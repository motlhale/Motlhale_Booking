/// <reference path="scripts/angular.js" />

var ClientService = angular.module('ClientService', []);
var PropertyService = angular.module('PropertyService', []);
var AddressService = angular.module('AddressService', []);
var BookingService = angular.module('BookingService', []);
var ReviewService = angular.module('ReviewService', []);
var EmailService = angular.module('EmailService',[]);

var urlBase = "http://localhost:11958/api";

ClientService.factory('ClientApi', function ($http) {
    var ClientApi = {};

    ClientApi.getClients = function () {
        return $http.get(urlBase + '/Clients');
    };

    ClientApi.getClient = function (client_email) {
        return $http.get(urlBase + '/Clients/' + client_email);
    };

    ClientApi.addClient = function (client) {
        return $http.post(urlBase + '/Clients/', client);
    };

    ClientApi.editClient = function (clientToUpdate) {
        var request = $http({
            method: 'put',
            url: urlBase + '/Clients/' + clientToUpdate.Client_email,
            data: clientToUpdate
        });
        return request;
    };

    ClientApi.getClientTypes = function () {
        return $http.get(urlBase + '/ClientTypes');
    };

    return ClientApi;
});

AddressService.factory('AddressApi', function ($http) {
    var AddressApi = {};
    AddressApi.getAddresses = function () {
        return $http.get(urlBase + '/Addresses');
    };

    AddressApi.getAddress = function (address_ID) {
        return $http.get(urlBase + '/Addresses/' + address_ID);
    };

    AddressApi.addAddress = function (address) {
        return $http.post(urlBase + '/Addresses/', address);
    };

    AddressApi.editAddress = function (addressToUpdate) {
        var request = $http({
            method: 'put',
            url: urlBase + '/Addresses/' + addressToUpdate.Address_ID,
            data: addressToUpdate
        });
        return request;
    };

    return AddressApi;
});

PropertyService.factory('PropertyApi', function ($http) {
    var PropertyApi = {};

    PropertyApi.getProperties = function () {
        return $http.get(urlBase + '/Properties');
    };

    PropertyApi.searchProperties = function (searchText) {
        return $http.get(urlBase + '/Properties/search/' + searchText);
    };

    PropertyApi.getProperty = function (Property_ID) {
        return $http.get(urlBase + '/Properties/' + Property_ID);
    };

    PropertyApi.addProperty = function (property) {
        return $http.post(urlBase + '/Properties/',property);
    };

    PropertyApi.editProperty = function (propertyToUpdate) {
        var request = $http({
            method: 'put',
            url: urlBase + '/Properties/' + propertyToUpdate.Property_ID,
            data: propertyToUpdate
        });
        return request;
    };

    PropertyApi.getPropertyTypes = function () {
        return $http.get(urlBase + '/PropertyTypes');
    };

    PropertyApi.getRooms = function () {
        return $http.get(urlBase + '/Rooms');
    };

    PropertyApi.addRoom = function (room) {
        return $http.post(urlBase + '/Rooms/', room);
    };

    PropertyApi.editRoom = function (roomToUpdate) {
        var request = $http({
            method: 'put',
            url: urlBase + '/Rooms/' + roomToUpdate.Room_ID,
            data: roomToUpdate
        });
        return request;
    };

    PropertyApi.getImages = function () {
        return $http.get(urlBase + '/ImageFiles');
    };

    PropertyApi.addImage = function (image) {
        return $http.post(urlBase + '/ImageFiles/', image);
    };

    return PropertyApi;
});

BookingService.factory('BookingApi', function ($http) {
    var BookingApi = {};

    BookingApi.getBookingRecords = function () {
        return $http.get(urlBase + '/BookingRecords');
    };

    BookingApi.getBookingRecord = function (bookingrecord_ID) {
        return $http.get(urlBase + '/BookingRecords/' + bookingrecord_ID);
    };

    BookingApi.addBookingRecord = function (bookingToAdd) {
        return $http.post(urlBase + '/BookingRecords/', bookingToAdd);
    };

    BookingApi.editBookingRecord = function (bookingToEdit) {
        var request = $http({
            method: 'put',
            url: urlBase + '/BookingRecords/' + bookingToEdit.BookingRecord_ID,
            data: bookingToEdit
        });
        return request;
    };

    BookingApi.deleteBookingRecord = function (bookingToDelete) {
        var request = $http({
            method: 'delete',
            url: urlBase + '/BookingRecords/' + bookingToDelete.BookingRecord_ID
        });
        return request;
    };

    BookingApi.getBookingRecordDetails = function () {
        return $http.get(urlBase + '/BookingRecordDetails');
    };
    BookingApi.addBookingRecordDetail = function (bookingDetailsToAdd) {
        return $http.post(urlBase + '/BookingRecordDetails/', bookingDetailsToAdd);
    };

    BookingApi.deleteBookingRecordDetail = function (bookingDetailToDelete) {
        var request = $http({
            method: 'delete',
            url: urlBase + '/BookingRecordDetails/' + bookingDetailToDelete.BookingRecordDetail_ID
        });
        return request;
    };

    BookingApi.getCardTypes = function () {
        return $http.get(urlBase + '/CardTypes');
    };

    BookingApi.getCards = function () {
        return $http.get(urlBase + '/Cards');
    };

    BookingApi.addCard = function (cardToAdd) {
        return $http.post(urlBase + '/Cards/', cardToAdd);
    };

    BookingApi.deleteCard = function (cardToDelete) {
        var request = $http({
            method: 'delete',
            url: urlBase + '/Cards/' + bookingToDelete.Card_Number
        });
        return request;
    };

    return BookingApi;
});

ReviewService.factory('ReviewApi', function ($http) {
    
    var ReviewApi = {};

    ReviewApi.getReviews = function () {
        return $http.get(urlBase + '/Reviews');
    };

    ReviewApi.addReview = function (reviewToAdd) {
        return $http.post(urlBase + '/Reviews/', reviewToAdd);
    };

    return ReviewApi;
});

EmailService.factory('EmailApi', function ($http) {
    var EmailApi = {};

    EmailApi.sendEmail = function (emailToSend) {
        return $http.post(urlBase + '/Clients/Email/', emailToSend);
    };
    return EmailApi;
});