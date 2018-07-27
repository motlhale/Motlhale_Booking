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
    public class CardTypesController : ApiController
    {
        private BookingDBEntities db = new BookingDBEntities();

        // GET: api/CardTypes
        public IQueryable<CardType> GetCardTypes()
        {
            return db.CardTypes;
        }

        // GET: api/CardTypes/5
        [ResponseType(typeof(CardType))]
        public IHttpActionResult GetCardType(int id)
        {
            CardType cardType = db.CardTypes.Find(id);
            if (cardType == null)
            {
                return NotFound();
            }

            return Ok(cardType);
        }

        // PUT: api/CardTypes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCardType(int id, CardType cardType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cardType.CardType_ID)
            {
                return BadRequest();
            }

            db.Entry(cardType).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CardTypeExists(id))
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

        // POST: api/CardTypes
        [ResponseType(typeof(CardType))]
        public IHttpActionResult PostCardType(CardType cardType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CardTypes.Add(cardType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (CardTypeExists(cardType.CardType_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = cardType.CardType_ID }, cardType);
        }

        // DELETE: api/CardTypes/5
        [ResponseType(typeof(CardType))]
        public IHttpActionResult DeleteCardType(int id)
        {
            CardType cardType = db.CardTypes.Find(id);
            if (cardType == null)
            {
                return NotFound();
            }

            db.CardTypes.Remove(cardType);
            db.SaveChanges();

            return Ok(cardType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CardTypeExists(int id)
        {
            return db.CardTypes.Count(e => e.CardType_ID == id) > 0;
        }
    }
}