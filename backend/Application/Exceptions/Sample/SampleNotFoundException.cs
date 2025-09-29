using System;
using System.Net;
using Shared.Resources;

namespace Application.Exceptions.Sample;

public class SampleNotFoundException(int id) : BaseException(string.Format(Messages.SampleNotFound, id), HttpStatusCode.NotFound)
{
}
