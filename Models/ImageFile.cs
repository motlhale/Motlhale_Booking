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
    
    public partial class ImageFile
    {
        public int Image_ID { get; set; }
        public byte[] Image_File { get; set; }
        public Nullable<int> Property_ID { get; set; }
    
        public virtual Property Property { get; set; }
    }
}