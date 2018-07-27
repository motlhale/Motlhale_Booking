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
    public class ClientTypesController : ApiController
    {
        private BookingDBEntities db = new BookingDBEntities();

        // GET: api/ClientTypes
        public IQueryable<ClientType> GetClientTypes()
        {
            return db.ClientTypes;
        }

        // GET: api/ClientTypes/5
        [ResponseType(typeof(ClientType))]
        public IHttpActionResult GetClientType(int id)
        {
            ClientType clientType = db.ClientTypes.Find(id);
            if (clientType == null)
            {
                return NotFound();
            }

            return Ok(clientType);
        }

        // PUT: api/ClientTypes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutClientType(int id, ClientType clientType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != clientType.ClientType_ID)
            {
                return BadRequest();
            }

            db.Entry(clientType).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientTypeExists(id))
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

        // POST: api/ClientTypes
        [ResponseType(typeof(ClientType))]
        public IHttpActionResult PostClientType(ClientType clientType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ClientTypes.Add(clientType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ClientTypeExists(clientType.ClientType_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = clientType.ClientType_ID }, clientType);
        }

        // DELETE: api/ClientTypes/5
        [ResponseType(typeof(ClientType))]
        public IHttpActionResult DeleteClientType(int id)
        {
            ClientType clientType = db.ClientTypes.Find(id);
            if (clientType == null)
            {
                return NotFound();
            }

            db.ClientTypes.Remove(clientType);
            db.SaveChanges();

            return Ok(clientType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ClientTypeExists(int id)
        {
            return db.ClientTypes.Count(e => e.ClientType_ID == id) > 0;
        }
    }
}