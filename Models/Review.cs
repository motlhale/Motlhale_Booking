//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BookingProject.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Review
    {
        public int Review_ID { get; set; }
        public Nullable<int> Review_Rating { get; set; }
        public string Review_Description { get; set; }
        public string Client_email { get; set; }
        public Nullable<int> Property_ID { get; set; }
    
        public virtual Client Client { get; set; }
        public virtual Property Property { get; set; }
    }
}