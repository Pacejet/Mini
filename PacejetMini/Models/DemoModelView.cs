using System;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.DependencyModel.Resolution;
using System.Collections.Generic;
using System.ComponentModel;

namespace PacejetMini.Models
{
    public class DemoModelView
    {
        public DemoModelView()
        {
            this.Packages = new List<Package>() { new Package { Height = 0, Length = 0, Weight = 0, Width = 0 } };
        }

        [DisplayName("Address 1")]
        public string OriginAddress1 { get; set; }
        [DisplayName("Address 2")]
        public string OriginAddress2 { get; set; }
        [DisplayName("City")]
        public string OriginCity { get; set; }
        [DisplayName("Postal")]
        public string OriginPostal { get; set; }
        [DisplayName("State")]
        public string OriginState { get; set; }
        [DisplayName("Country")]
        public string OriginCountry { get; set; }
        [DisplayName("Residential Address")]
        public bool OriginResidential { get; set; }
        [DisplayName("Address 1")]
        public string DestinationAddress1 { get; set; }
        [DisplayName("Address 2")]
        public string DestinationAddress2 { get; set; }
        [DisplayName("City")]
        public string DestinationCity { get; set; }
        [DisplayName("Postal Code")]
        public string DestinationPostal { get; set; }
        [DisplayName("State")]
        public string DestinationState { get; set; }
        [DisplayName("Country")]
        public string DestinationCountry { get; set; }
        [DisplayName("Residential Address")]
        public bool DestinationResidential { get; set; }
        [DisplayName("Packages")]
        public List<Package> Packages { get; set; }

        public class Package
        {
            [DisplayName("Weight")]
            public decimal Weight { get; set; }
            [DisplayName("Width")]
            public decimal Width { get; set; }
            [DisplayName("Height")]
            public decimal Height { get; set; }
            [DisplayName("Length")]
            public decimal Length { get; set; }
        }

    }
}
