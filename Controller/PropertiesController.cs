using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using BookingProject.Models;

namespace BookingProject.Controller
{
    public class PropertiesController : ApiController
    {
        private BookingDBEntities db = new BookingDBEntities();

        //api/Properties/search
        [Route("api/Properties/search/{id}")]
        [HttpGet]
        [ResponseType(typeof(Property))]
        public IEnumerable<Property> GetProperty(string id)
        {
            List<Property> property = db.Properties.SqlQuery("select Property_ID,Property_Name,property_Description,Property_No_Rooms,PropertyType_ID,Property.Address_ID,Client_email from Property join Address on Property.Address_ID = Address.Address_ID  where Property_Name like '%" + id + "%' or Address.City like '%" + id + "%' or Address.Country like '%" + id + "%'").ToList();
            return property;
        }


        // GET: api/Properties
        public IQueryable<Property> GetProperties()
        {
            return db.Properties;
        }


        // GET: api/Properties/5
        [ResponseType(typeof(Property))]
        public IHttpActionResult GetProperty(int id)
        {
            Property property = db.Properties.Find(id);
            if (property == null)
            {
                return NotFound();
            }

            return Ok(property);
        }


        // PUT: api/Properties/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutProperty(int id, Property property)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != property.Property_ID)
            {
                return BadRequest();
            }

            db.Entry(property).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropertyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Properties
        [ResponseType(typeof(Property))]
        public IHttpActionResult PostProperty(Property property)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Properties.Add(property);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (PropertyExists(property.Property_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = property.Property_ID }, property);
        }

        // DELETE: api/Properties/5
        [ResponseType(typeof(Property))]
        public IHttpActionResult DeleteProperty(int id)
        {
            Property property = db.Properties.Find(id);
            if (property == null)
            {
                return NotFound();
            }

            db.Properties.Remove(property);
            db.SaveChanges();

            return Ok(property);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PropertyExists(int id)
        {
            return db.Properties.Count(e => e.Property_ID == id) > 0;
        }
    }
}