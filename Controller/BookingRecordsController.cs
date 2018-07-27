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
    public class BookingRecordsController : ApiController
    {
        private BookingDBEntities db = new BookingDBEntities();

        // GET: api/BookingRecords
        public IQueryable<BookingRecord> GetBookingRecords()
        {
            return db.BookingRecords;
        }

        // GET: api/BookingRecords/5
        [ResponseType(typeof(BookingRecord))]
        public IHttpActionResult GetBookingRecord(int id)
        {
            BookingRecord bookingRecord = db.BookingRecords.Find(id);
            if (bookingRecord == null)
            {
                return NotFound();
            }

            return Ok(bookingRecord);
        }

        // PUT: api/BookingRecords/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutBookingRecord(int id, BookingRecord bookingRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != bookingRecord.BookingRecord_ID)
            {
                return BadRequest();
            }

            db.Entry(bookingRecord).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingRecordExists(id))
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

        // POST: api/BookingRecords
        [ResponseType(typeof(BookingRecord))]
        public IHttpActionResult PostBookingRecord(BookingRecord bookingRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.BookingRecords.Add(bookingRecord);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (BookingRecordExists(bookingRecord.BookingRecord_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = bookingRecord.BookingRecord_ID }, bookingRecord);
        }

        // DELETE: api/BookingRecords/5
        [ResponseType(typeof(BookingRecord))]
        public IHttpActionResult DeleteBookingRecord(int id)
        {
            BookingRecord bookingRecord = db.BookingRecords.Find(id);
            if (bookingRecord == null)
            {
                return NotFound();
            }

            db.BookingRecords.Remove(bookingRecord);
            db.SaveChanges();

            return Ok(bookingRecord);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BookingRecordExists(int id)
        {
            return db.BookingRecords.Count(e => e.BookingRecord_ID == id) > 0;
        }
    }
}