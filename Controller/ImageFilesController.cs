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
    public class ImageFilesController : ApiController
    {
        private BookingDBEntities db = new BookingDBEntities();

        // GET: api/ImageFiles
        public IQueryable<ImageFile> GetImageFiles()
        {
            return db.ImageFiles;
        }

        // GET: api/ImageFiles/5
        [ResponseType(typeof(ImageFile))]
        public IHttpActionResult GetImageFile(int id)
        {
            ImageFile imageFile = db.ImageFiles.Find(id);
            if (imageFile == null)
            {
                return NotFound();
            }

            return Ok(imageFile);
        }

        // PUT: api/ImageFiles/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutImageFile(int id, ImageFile imageFile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != imageFile.Image_ID)
            {
                return BadRequest();
            }

            db.Entry(imageFile).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImageFileExists(id))
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

        // POST: api/ImageFiles
        [ResponseType(typeof(ImageFile))]
        public IHttpActionResult PostImageFile(ImageFile imageFile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ImageFiles.Add(imageFile);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ImageFileExists(imageFile.Image_ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = imageFile.Image_ID }, imageFile);
        }

        // DELETE: api/ImageFiles/5
        [ResponseType(typeof(ImageFile))]
        public IHttpActionResult DeleteImageFile(int id)
        {
            ImageFile imageFile = db.ImageFiles.Find(id);
            if (imageFile == null)
            {
                return NotFound();
            }

            db.ImageFiles.Remove(imageFile);
            db.SaveChanges();

            return Ok(imageFile);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ImageFileExists(int id)
        {
            return db.ImageFiles.Count(e => e.Image_ID == id) > 0;
        }
    }
}