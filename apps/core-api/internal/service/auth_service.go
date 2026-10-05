package service

import (
	"context"
	"errors"
	"net/mail"
	"strings"

	"ephemeral/apps/core-api/internal/repository"
	"ephemeral/packages/go-shared/auth"
	"ephemeral/packages/go-shared/models"
)

var (
	ErrInvalidEmail       = errors.New("invalid email address")
	ErrWeakPassword       = errors.New("password must be at least 8 characters long")
	ErrInvalidRole        = errors.New("invalid user role")
	ErrEmailTaken         = errors.New("email already taken")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrMissingFields      = errors.New("name, email, and password are required")
)

type AuthService struct {
	userRepo  *repository.UserRepository
	jwtSecret string
}

func NewAuthService(userRepo *repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

type RegisterInput struct {
	Email    string          `json:"email"`
	Password string          `json:"password"`
	Name     string          `json:"name"`
	Role     models.UserRole `json:"role"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResult struct {
	Token string             `json:"token"`
	User  models.UserProfile `json:"user"`
}

func (s *AuthService) Register(ctx context.Context, input RegisterInput) (*models.UserProfile, error) {
	email := strings.TrimSpace(strings.ToLower(input.Email))
	name := strings.TrimSpace(input.Name)

	if email == "" || input.Password == "" || name == "" {
		return nil, ErrMissingFields
	}

	// Validate email format
	parsedEmail, err := mail.ParseAddress(email)
	if err != nil || !strings.Contains(parsedEmail.Address, ".") {
		return nil, ErrInvalidEmail
	}

	// Validate password strength
	if len(input.Password) < 8 {
		return nil, ErrWeakPassword
	}

	// Validate role
	role := input.Role
	if role == "" {
		role = models.RoleConsumer
	}
	if !role.IsValid() {
		return nil, ErrInvalidRole
	}

	// Hash password with bcrypt cost 12
	hashedPassword, err := auth.HashPassword(input.Password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:        email,
		Name:         name,
		PasswordHash: hashedPassword,
		Role:         role,
	}

	createdUser, err := s.userRepo.Create(ctx, user)
	if err != nil {
		if errors.Is(err, repository.ErrDuplicateEmail) {
			return nil, ErrEmailTaken
		}
		return nil, err
	}

	profile := createdUser.ToProfile()
	return &profile, nil
}

func (s *AuthService) Login(ctx context.Context, input LoginInput) (*LoginResult, error) {
	email := strings.TrimSpace(strings.ToLower(input.Email))
	if email == "" || input.Password == "" {
		return nil, ErrInvalidCredentials
	}

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if !auth.CheckPasswordHash(input.Password, user.PasswordHash) {
		return nil, ErrInvalidCredentials
	}

	token, err := auth.GenerateJWT(s.jwtSecret, user.ID, string(user.Role))
	if err != nil {
		return nil, err
	}

	return &LoginResult{
		Token: token,
		User:  user.ToProfile(),
	}, nil
}

func (s *AuthService) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	return s.userRepo.FindByID(ctx, id)
}
