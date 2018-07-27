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
    public class BookingRecordDetailsController : ApiController
    {
        private BookingDBEntities db = new BookingDBEntities();

        // GET: api/BookingRecordDetails
        public IQueryable<BookingRecordDetail> GetBookingRecordDetails()
        {
            return db.BookingRecordDetails;
        }

        // GET: api/BookingRecordDetails/5
        [ResponseType(typeof(BookingRecordDetail))]
        public IHttpActionResult GetBookingRecordDetail(int id)
        {
            BookingRecordDetail bookingRecordDetail = db.BookingRecordDetails.Find(id);
            if (bookingRecordDetail == null)
            {
                return NotFound();
            }

            return Ok(bookingRecordDetail);
        }

        // PUT: api/BookingRecordDetails/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutBookingRecordDetail(int id, BookingRecordDetail bookingRecordDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != bookingRecordDetail.BookingRecordDetail_ID)
            {
                return BadRequest();
            }

            db.Entry(bookingRecordDetail).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingRecordDetailExists(id))
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

        // POST: api/BookingRecordDetails
        [ResponseType(typeof(BookingRecordDetail))]
        public IHttpActionResult PostBookingRecordDetail(BookingRecordDetail bookingRecordDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.BookingRecordDetails.Add(bookingRecordDetail);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (BookingRecordDetailExists(bookingRecordDetail.BookingRecordDetail_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = bookingRecordDetail.BookingRecordDetail_ID }, bookingRecordDetail);
        }

        // DELETE: api/BookingRecordDetails/5
        [ResponseType(typeof(BookingRecordDetail))]
        public IHttpActionResult DeleteBookingRecordDetail(int id)
        {
            BookingRecordDetail bookingRecordDetail = db.BookingRecordDetails.Find(id);
            if (bookingRecordDetail == null)
            {
                return NotFound();
            }

            db.BookingRecordDetails.Remove(bookingRecordDetail);
            db.SaveChanges();

            return Ok(bookingRecordDetail);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BookingRecordDetailExists(int id)
        {
            return db.BookingRecordDetails.Count(e => e.BookingRecordDetail_ID == id) > 0;
        }
    }
}