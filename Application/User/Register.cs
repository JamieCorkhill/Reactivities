using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class Register
    {
        // One-time exception - this command will return a user
        // (despite the fact that commands should return void)
        // for pragmatism.
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly DataContext _context;

            public Handler(
                DataContext dataContext, 
                UserManager<AppUser> userManager, 
                IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _context = dataContext;
            }
            
            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                var emailInUse = await _context.Users
                    .Where(x => x.Email == request.Email).AnyAsync();

                var usernameInUse = await _context.Users
                    .Where(x => x.UserName == request.Username).AnyAsync();
                
                if (emailInUse)
                {
                    throw new RestException(HttpStatusCode.Conflict, new
                    {
                        Email = "Email already exists"
                    });
                }

                if (usernameInUse)
                {
                    throw new RestException(HttpStatusCode.Conflict, new
                    {
                        Username = "Email already exists"
                    });
                }

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Token = _jwtGenerator.CreateToken(user),
                        Username = user.UserName,
                        Image = null
                    };
                }

                throw new Exception("Could not create user");
            }
        }
    }
}