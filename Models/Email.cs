using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BookingProject.Models
{
    public class Email
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailTo { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}