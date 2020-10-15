using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Details
{
    internal class Query : IRequest<ActionResult<Activity>>
    {
    }
}