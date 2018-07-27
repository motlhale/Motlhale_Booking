/// <reference path="scripts/angular.js" />

var mainApp = angular.module("mainApp", ['ngCookies','ngRoute', 'ClientService', 'PropertyService', 'AddressService', 'BookingService','ReviewService','EmailService']);

mainApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/Home', {
                templateUrl: 'Views/Home.html'
            }).
            when('/Register', {
                templateUrl: 'Views/Register.html'
            }).
            when('/SignIn', {
                templateUrl: 'Views/SignIn.html'
            }).
            when('/Property', {
                templateUrl: 'Views/Property.html'
            }).
            when('/Book', {
                templateUrl: 'Views/Book.html'
            }).
            when('/Listing', {
                templateUrl: 'Views/Listing.html'
            }).
            when('/ManageBook', {
                templateUrl: 'Views/ManageBook.html'
            }).
            when('/Admin', {
                templateUrl: 'Views/Admin.html'
            }).
            when('/Search', {
                templateUrl: 'Views/Search.html'
            }).
            when('/Manager', {
                templateUrl: 'Views/Manager.html'
            }).
            otherwise({
                redirectTo: '/Home'
            });
    }]);

mainApp.factory("LoggedIn", function () {
    var LoggedIn = {};

    LoggedIn.Client = function (Client) {
        return Client;
    }

    LoggedIn.Card = function (Card) {
        return Card;
    }

    LoggedIn.Property = function (Property) {
        return Property;
    }

    return LoggedIn
});

mainApp.factory("BookedProperty", function () {

    var BookedProperty = {};

    BookedProperty.Property = function (Property) {
        return Property;
    }

    BookedProperty.Record = function (Record) {
        return Record;
    }

    return BookedProperty;
});

mainApp.factory("SearchProperty", function () {
    var SearchProperty = {};

    SearchProperty.Properties = function (Properties) {
        return Properties;
    }

    SearchProperty.Text = function (Text) {
        return Text;
    }

    SearchProperty.CheckIn = function (CheckIn) {
        return CheckIn;
    }

    SearchProperty.CheckOut = function (CheckOut) {
        return  CheckOut;
    }

    SearchProperty.People = function (People) {
        return People;
    }

    return SearchProperty; 
});

//Buttons
mainApp.controller("ButtonsController", function ($scope,$cookies, LoggedIn) {

    $scope.Registered = true;
    $scope.message = "Sign In";

    if ($cookies.get('cookie') != null) {
        $scope.Registered = false;
        $scope.message = "Sign Out";
        $scope.SignInAction = function () {
            $cookies.remove('cookie')
            window.location.reload();
            window.location.href = "http://localhost:11958/#!/Home";
        }
    }
    else {
        $scope.SignInAction = function () {
            window.location.href = "http://localhost:11958/#!/SignIn";
        }
    }
});

//LogIn
mainApp.controller("loginViewController", function ($scope, $cookies, ClientApi, LoggedIn,PropertyApi,BookingApi) {  

    if ($cookies.get('cookie') != null) {
        $scope.LoggedIn = true;
        $scope.myCookie = $cookies.get('cookie');
        ClientApi.getClient($scope.myCookie).then(function (response) {
            LoggedIn.Client = response.data;
            LoggedIn.Client.Client_email = LoggedIn.Client.Client_email.replace("dot", ".");
            $scope.message = "Signed in as " + LoggedIn.Client.Client_Name;
            $scope.Client_email = LoggedIn.Client.Client_email;
            $scope.Client_Name = LoggedIn.Client.Client_Name;
            $scope.Client_Password = LoggedIn.Client.Client_Password;
            $scope.Phone_Number = LoggedIn.Client.Phone_Number;
            $scope.Client_Title = LoggedIn.Client.Client_Title;
            $scope.Client_FirstName = LoggedIn.Client.Client_FirstName;
            $scope.Client_LastName = LoggedIn.Client.Client_LastName;

            $scope.AddressLine_1 = LoggedIn.Client.Address.AddressLine_1;
            $scope.AddressLine_2 = LoggedIn.Client.Address.AddressLine_2;
            $scope.AddressLine_3 = LoggedIn.Client.Address.AddressLine_3;
            $scope.City = LoggedIn.Client.Address.City;
            $scope.Country = LoggedIn.Client.Address.Country;
            $scope.Zip_Code = LoggedIn.Client.Address.Zip_Code;

            var onSucces = function (response) {
                $scope.Properties = response.data;
                $scope.Bookings = [];
                LoggedIn.Client.Client_email = LoggedIn.Client.Client_email.replace(".", "dot");
                var count = 0;
                for (property in $scope.Properties) {
                    if ($scope.Properties[property].Client_email == LoggedIn.Client.Client_email) {
                        LoggedIn.Client.Properties[count] = $scope.Properties[property];
                        for (record in LoggedIn.Client.Properties[count].BookingRecordDetails) {
                            $scope.Bookings.push(LoggedIn.Client.Properties[count].BookingRecordDetails[record]);
                        }
                        count = count + 1;
                    }
                }

                $scope.Properties = LoggedIn.Client.Properties;

                if (LoggedIn.Client.Properties.length != 0) {
                    $scope.selectedItem = "Manage Properties";

                    $scope.dropboxitemselected = function (property) {
                        $scope.selectedItem = property.Property_Name;
                        $scope.Property = property;

                        $scope.Property_ID = $scope.Property.Property_ID;
                        $scope.Property_Name = $scope.Property.Property_Name;
                        $scope.property_Description = $scope.Property.property_Description;
                        $scope.Property_No_Rooms = $scope.Property.Property_No_Rooms;
                        $scope.PropertyType_ID = $scope.Property.PropertyType_ID;

                        $scope.Address_ID = $scope.Property.Address_ID;
                        $scope.PropertyAddressLine_1 = $scope.Property.Address.AddressLine_1;
                        $scope.PropertyAddressLine_2 = $scope.Property.Address.AddressLine_2;
                        $scope.PropertyAddressLine_3 = $scope.Property.Address.AddressLine_3;
                        $scope.PropertyCity = $scope.Property.Address.City;
                        $scope.PropertyCountry = $scope.Property.Address.Country;
                        $scope.PropertyZip_Code = $scope.Property.Address.Zip_Code;
                        if ($scope.Property.ImageFiles.length > 0) {
                            $scope.image_src = $scope.Property.ImageFiles[0].Image_File;
                        }
                        else {
                            $scope.image_src = null;
                        }

                        $scope.InsertRoomData = function (room) {
                            $scope.Room_ID = room.Room_ID;
                            $scope.Room_Name = room.Room_Name;
                            $scope.Room_Description = room.Room_Description;
                            $scope.Room_No_Occupants = room.Room_No_Occupants;
                            $scope.Room_Price = room.Room_Price;
                        };
                    };
                }
                else {
                    $scope.selectedItem = "No registered properties";
                }

                if ($scope.Bookings.length > 0) {
                    $scope.Bookingmessage = "View Bookings";

                    $scope.selectedBooking = function (booking) {


                        PropertyApi.getProperty(booking.Property_ID).then(function (response) {
                            $scope.property = response.data;
                            $scope.Bookingmessage = booking.BookingRecordDetail_ID;
                            $scope.BookProperty_Name = $scope.property.Property_Name;
                            $scope.BookRoom_Name = booking.Room.Room_Name;
                            $scope.BookCheckIn_Date = booking.CheckIn_Date;
                            $scope.BookCheckOut_Date = booking.CheckOut_Date;
                            $scope.BookClient_email = booking.BookingRecord.Client_email;
                            $scope.BookClient_FirstName = booking.BookingRecord.Client_FirstName;
                            $scope.BookClient_LastName = booking.BookingRecord.Client_LastName;
                        }, onFailure);
                    };
                }
                else {
                    $scope.Bookingmessage = "No booking recorded";
                }

            };

            var onFailure = function (reason) { $scope.error = reason };

            getProperties();
            function getProperties() {
                PropertyApi.getProperties().then(onSucces, onFailure);
            }
        }, function (reason) { $scope.error = reason });
        
    }
    else {
        $scope.message = "Sign in to make reservations faster";
    }

});

//SignIn
mainApp.controller("SignInController", function ($scope, $cookies, ClientApi, AddressApi, PropertyApi, LoggedIn) {

    var onSucces = function (response) {
        $scope.client = response.data;
        if ($scope.client.Client_Password == $scope.Client_Password) {
            alert("You are signed in welcome... " + $scope.client.Client_Name);
            $cookies.put('cookie', $scope.client.Client_email);
            if ($scope.client.ClientType_ID == 1) {
                window.location.href = "http://localhost:11958/#!/Admin";
            }
            if ($scope.client.ClientType_ID == 2 || $scope.client.Properties.length > 0) {
                window.location.href = "http://localhost:11958/#!/Manager";
            }
            if ($scope.client.ClientType_ID == 3 && $scope.client.Properties.length == 0) {
                window.location.href = "http://localhost:11958/#!/Home";
            }
        }
        else {
            alert("Password does not match email address");
        }
    };

    var onFailure = function (reason) { $scope.error = reason; alert("email address does not exist") };

    $scope.SignIn = function () {

        if ($scope.Client_email != null && $scope.Client_Password != null) {

            var email = $scope.Client_email;
            email = email.replace(".", "dot");

            if (ClientApi.getClient(email).then(onSucces, onFailure)) {

            }
            else {
                alert("email address does not exist");
            }
        }
        else {
            alert("enter sign in information");
        }
    };
});

//Client
mainApp.controller("GetClientsController", function ($scope, ClientApi) {

    var onSuccess = function (response) {
        $scope.Clients = response.data
        for (client in $scope.Clients) {
            $scope.Clients[client].Client_email = $scope.Clients[client].Client_email.replace("dot",".")
        }
    };

    var onFailure = function (reason) { $scope.error = reason };

    getClients();
    function getClients() {
        ClientApi.getClients().then(onSuccess, onFailure);
    }
});

mainApp.controller("AddClientController", function ($scope,$cookies, ClientApi, AddressApi, LoggedIn) {

    var count = 0;
    $scope.Types = [];

    var onSucces = function (response) {
        alert("You are are now registered");

        var email = $scope.Client_email;
        email = email.replace(".", "dot");
        $cookies.put('cookie', email);

        ClientApi.getClient(email).then(function (response) {
            $scope.client = response.data;
            alert("You are signed in welcome... " + $scope.client.Client_Name);
            window.location.href = "http://localhost:11958/#!/Home";}, onFailure)
    };

    var onFailure = function (reason) { $scope.error = reason };

    getAddresses();
    function getAddresses() {
        AddressApi.getAddresses().then(function (response) { $scope.Addresses = response.data }, onFailure);
    };

    getClientTypes();
    function getClientTypes() {
        ClientApi.getClientTypes().then(function (response) {
            $scope.ClientTypes = response.data;
            for (type in $scope.ClientTypes) {
                if ($scope.ClientTypes[type].Type_Description != "Admin") {
                    $scope.Types[count++] = $scope.ClientTypes[type];
                }
            }
        }, onFailure);
    };

    $scope.selectedType = "select Type";

    $scope.selectedClientType = function (type) {
        $scope.selectedType = type.Type_Description;
        $scope.Type = type;
    };

    $scope.addClient = function () {
        var email = $scope.Client_email;
        email = email.replace(".", "dot");
        var clientToAdd = {
            'Client_email': email,
            'Client_Name': $scope.Client_Name,
            'Client_Password': $scope.Client_Password,
            'Phone_Number': $scope.Phone_Number,
            'Client_Title': $scope.Client_Title,
            'Client_FirstName': $scope.Client_FirstName,
            'Client_LastName': $scope.Client_LastName,
            'Address_ID': $scope.Addresses.length + 1,
            'ClientType_ID': $scope.Type.ClientType_ID
        };

        var addressToAdd = {
            'Address_ID': $scope.Addresses.length+1
        };

        AddressApi.addAddress(addressToAdd).then(function (response) { ClientApi.addClient(clientToAdd).then(onSucces, onFailure); }, function (reason) { $scope.error = reason });
        
    };

});

mainApp.controller("UpdateClientController", function ($scope, ClientApi, AddressApi, LoggedIn) {
    var onSucces = function (response) { alert("You have succefully updated your information"); };

    var onFailure = function (reason) { $scope.error = reason };

    $scope.UpdateClient = function () {
        var email = $scope.Client_email;
        email = email.replace(".", "dot");

        var clientToUpdate = {
            'Client_email': email,
            'Client_Name': $scope.Client_Name,
            'Client_Password': $scope.Client_Password,
            'Phone_Number': $scope.Phone_Number,
            'Client_Title': $scope.Client_Title,
            'Client_FirstName': $scope.Client_FirstName,
            'Client_LastName': $scope.Client_LastName,
            'Address_ID': LoggedIn.Client.Address_ID,
            'ClientType_ID': LoggedIn.Client.ClientType_ID
        };

        ClientApi.editClient(clientToUpdate).then(onSucces, onFailure)
    };

    $scope.UpdateAddress = function () {

        var addressToUpdate = { 
            'Address_ID': LoggedIn.Client.Address_ID,
            'AddressLine_1': $scope.AddressLine_1,
            'AddressLine_2': $scope.AddressLine_2,
            'AddressLine_3': $scope.AddressLine_3,
            'City': $scope.City,
            'Country': $scope.Country,
            'Zip_Code': $scope.Zip_Code
        };

        AddressApi.editAddress(addressToUpdate).then(function (response) { alert("You have succefully updated your information") }, function (reason) { $scope.error = reason });
    };
});

mainApp.controller("AddAdminController", function ($scope, ClientApi, AddressApi) {
    var onFailure = function (reason) { $scope.error = reason };

    getAddresses();
    function getAddresses() {
        AddressApi.getAddresses().then(function (response) { $scope.Addresses = response.data }, onFailure);
    };

    getClientTypes();
    function getClientTypes() {
        ClientApi.getClientTypes().then(function (response) {
            $scope.ClientTypes = response.data;
        }, onFailure);
    };

    $scope.selectedType = "select Type";

    $scope.selectedClientType = function (type) {
        $scope.selectedType = type.Type_Description;
        $scope.Type = type;
    };

    $scope.addClient = function () {
        var email = $scope.Client_email;
        email = email.replace(".", "dot");
        var clientToAdd = {
            'Client_email': email,
            'Client_Name': $scope.Client_Name,
            'Client_Password': "password",
            'Phone_Number': $scope.Phone_Number,
            'Client_Title': $scope.Client_Title,
            'Client_FirstName': $scope.Client_FirstName,
            'Client_LastName': $scope.Client_LastName,
            'Address_ID': $scope.Addresses.length + 1,
            'ClientType_ID': $scope.Type.ClientType_ID
        };

        var addressToAdd = {
            'Address_ID': $scope.Addresses.length + 1
        };

        AddressApi.addAddress(addressToAdd).then(function (response) { ClientApi.addClient(clientToAdd).then(alert("Client Added"), onFailure); }, function (reason) { $scope.error = reason });

    };
});

//Properties
mainApp.controller("GetPropertiesController", function ($scope, PropertyApi, BookedProperty) {

    var onSuccess = function (response) {
        $scope.Properties = response.data;
        for (property in $scope.Properties) {
            $scope.image = $scope.Properties[property].ImageFiles[0].Image_File;
        }
    };

    var onFailure = function (reason) { $scope.error = reason };

    getProperties();
    function getProperties() {
        PropertyApi.getProperties().then(onSuccess, onFailure);
    }

    $scope.BookProperty = function (property) {
        BookedProperty.Property = property;
    }
});

var AddPropertyController = function ($scope, PropertyApi, AddressApi, LoggedIn) {
    var onSucces = function (response) { $scope.PropertyType = response.data };

    var onFailure = function (reason) { $scope.error = reason };

    $scope.selectedItem = "Select Property Type";
    if (LoggedIn.Client.Client_email != null) {

        getPropertyTypes();
        function getPropertyTypes() {
            PropertyApi.getPropertyTypes().then(onSucces, onFailure);
        }

        $scope.dropboxitemselected = function (propertyType) {
            $scope.selectedItem = propertyType.PropertyType_Description;
            $scope.propertyType = propertyType;
        };

        getAddresses();
        function getAddresses() {
            AddressApi.getAddresses().then(function (response) { $scope.Addresses = response.data }, function (reason) { $scope.error = reason });
        };

        getProperties();
        function getProperties() {
            PropertyApi.getProperties().then(function (response) { $scope.Properties = response.data }, function (reason) { $scope.error = reason });
        };

        getRooms();
        function getRooms() {
            PropertyApi.getRooms().then(function (response) { $scope.Rooms = response.data }, function (reason) { $scope.error = reason });
        };

        $scope.addProperty = function () {

            var addressToAdd = {
                'Address_ID': $scope.Addresses.length + 1,
                'AddressLine_1': $scope.AddressLine_1,
                'AddressLine_2': $scope.AddressLine_2,
                'AddressLine_3': $scope.AddressLine_3,
                'City': $scope.City,
                'Country': $scope.Country,
                'Zip_Code': $scope.Zip_Code,
            };

            LoggedIn.Client.Client_email = LoggedIn.Client.Client_email.replace(".", "dot");
            var propertyToAdd = {
                'Property_ID': $scope.Properties.length + 1,
                'Property_Name': $scope.Property_Name,
                'property_Description': $scope.property_Description,
                'Property_No_Rooms': $scope.Property_No_Rooms,
                'PropertyType_ID': $scope.propertyType.PropertyType_ID,
                'Address_ID': $scope.Addresses.length + 1,
                'Client_email': LoggedIn.Client.Client_email
            };



            AddressApi.addAddress(addressToAdd).then(function (response) { }, function (reason) { $scope.error = reason });
            PropertyApi.addProperty(propertyToAdd).then(function (response) {
                alert("Property Added");
                LoggedIn.Property = propertyToAdd;
                var i;
                for (i = 0; i < $scope.Property_No_Rooms; i++) {
                    var roomToAdd = {
                        'Room_ID': $scope.Rooms.length + 1 + i,
                        'Property_ID': $scope.Properties.length + 1
                    };

                    PropertyApi.addRoom(roomToAdd).then(function (response) { if (i == $scope.Property_No_Rooms) { alert("Rooms added"); window.location.href = "http://localhost:11958/#!/Home" } }, function (reason) { $scope.error = reason });
                }
            }, function (reason) { $scope.error = reason });            
        };

    }
    else {
        window.location.href = "http://localhost:11958/#!/SignIn";
    }
}
mainApp.controller("AddPropertyController", AddPropertyController);

mainApp.controller("UpdatePropertyController", function ($scope, PropertyApi, AddressApi, LoggedIn) {

    var onSucces = function (response) { $scope.PropertyType = response.data };

    var onFailure = function (reason) { $scope.error = reason };

    getPropertyTypes();
    function getPropertyTypes() {
        PropertyApi.getPropertyTypes().then(onSucces, onFailure);
    }

    getImages();
    function getImages() {
        PropertyApi.getImages().then(function (response) { $scope.Images = response.data }, onFailure);
    }

    $scope.selectedItem = "Select Property Type";

    $scope.dropboxitemselected = function (propertyType) {
        $scope.selectedItem = propertyType.PropertyType_Description;
        $scope.propertyType = propertyType;
    };

    $scope.UploadImage = function () {
        
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();

        reader.readAsDataURL(file);
        

        setTimeout(function () {
            alert("Image is loading...Press okay to continue");
            var imageToUpload = {
                'Image_ID': $scope.Images.length + 1,
                'Image_File': reader.result.split(',')[1],
                'Property_ID': $scope.Property_ID
            }
            if (imageToUpload.Image_File != null) {
                PropertyApi.addImage(imageToUpload).then(function () { alert("Image uploaded"); window.location.reload(); }, onFailure);
            }
        }, 5000);
    };

    $scope.UpdateProperty = function () {
        var email = $scope.Client_email;
        email = email.replace(".", "dot");

        var propertyToUpdate = {
            'Property_ID': $scope.Property_ID,
            'Property_Name': $scope.Property_Name,
            'property_Description': $scope.property_Description,
            'Property_No_Rooms': $scope.Property_No_Rooms,
            'PropertyType_ID': $scope.propertyType.PropertyType_ID,
            'Address_ID': $scope.Address_ID,
            'Client_email': email
        };

        var addressToUpdate = {
            'Address_ID': $scope.Address_ID,
            'AddressLine_1': $scope.PropertyAddressLine_1,
            'AddressLine_2': $scope.PropertyAddressLine_2,
            'AddressLine_3': $scope.PropertyAddressLine_3,
            'City': $scope.PropertyCity,
            'Country': $scope.PropertyCountry,
            'Zip_Code': $scope.PropertyZip_Code
        };

        AddressApi.editAddress(addressToUpdate).then(function (response) {  }, function (reason) { $scope.error = reason });
        PropertyApi.editProperty(propertyToUpdate).then(function (response) { alert("Property Updated") }, onFailure);
    };

});

//Rooms
mainApp.controller("AddRoomController", function ($scope, PropertyApi) {

    var onSuccess = function (response) { $scope.Rooms = response.data };

    var onFailure = function (reason) { $scope.error = reason };

    getRooms();
    function getRooms() {
        PropertyApi.getRooms().then(onSuccess, onFailure);
    }; 

    $scope.addRoom = function () {
        var roomToAdd = {
            'Room_ID': $scope.Rooms.length + 1,
            'Room_Name': $scope.Room_Name,
            'Room_Decription': $scope.Room_Decription,
            'Room_No_Occupants': $scope.Room_No_Occupants,
            'Room_Price': $scope.Room_Price,
            'Property_ID': $scope.Properties.length
        };

        PropertyApi.addRoom(roomToAdd).then(function (response) { alert("Room Added") }, function (reason) { $scope.error = reason })
    }

});

mainApp.controller("UpdateRoomController", function ($scope, PropertyApi, LoggedIn) {
    var onSucces = function (response) { alert("Room information Updated"); window.location.reload(); };

    var onFailure = function (reason) { $scope.error = reason };

    $scope.InsertRoomData = function (room) {
        $scope.Room_ID = room.Room_ID;
        $scope.Room_Name = room.Room_Name;
        $scope.Room_Description = room.Room_Description;
        $scope.Room_No_Occupants = room.Room_No_Occupants;
        $scope.Room_Price = room.Room_Price;
    };

    $scope.UpdateRoom = function () {
        var roomToUpdate = {
            'Room_ID': $scope.Room_ID,
            'Room_Name': $scope.Room_Name,
            'Room_Description': $scope.Room_Description,
            'Room_No_Occupants': $scope.Room_No_Occupants,
            'Room_Price': $scope.Room_Price,
            'Property_ID': $scope.Property_ID
        };

        PropertyApi.editRoom(roomToUpdate).then(onSucces, onFailure)
    };
});

//Bookings
mainApp.controller("GetBookingsController", function ($scope, BookingApi) {
    var onSuccess = function (response) {
        $scope.Bookings = response.data
    };

    var onFailure = function (reason) { $scope.error = reason };

    getBookingRecords();
    function getBookingRecords() {
        BookingApi.getBookingRecords().then(onSuccess, onFailure);
    };
});

mainApp.controller("AddBookingController", function ($scope,EmailApi, PropertyApi, BookingApi, BookedProperty, LoggedIn, SearchProperty) {

    $scope.CheckedRoom = [];
    $scope.image = BookedProperty.Property.ImageFiles[0].Image_File;
    var count = 0
    var total = 0;

    var onFailure = function (reason) { $scope.error = reason };

    getBookingRecords();
    function getBookingRecords() {
        BookingApi.getBookingRecords().then(function (response) { $scope.BookingRecords = response.data; $scope.BookingRecord_ID = $scope.BookingRecords.length + 1; }, onFailure);
    };

    getBookingRecordDetails();
    function getBookingRecordDetails() {
        BookingApi.getBookingRecordDetails().then(function (response) { $scope.BookingRecordDetails = response.data }, onFailure);
    };

    if (LoggedIn.Client.Client_email != null) {
        email = LoggedIn.Client.Client_email;
        email = email.replace("dot", ".");
        $scope.Client_email = email;
        $scope.Client_FirstName = LoggedIn.Client.Client_FirstName;
        $scope.Client_LastName = LoggedIn.Client.Client_LastName;
    }
   
    $scope.Rooms = BookedProperty.Property.Rooms;
    $scope.Property_Name = BookedProperty.Property.Property_Name;
    $scope.property_Description = BookedProperty.Property.property_Description

    $scope.CheckIn_Date = SearchProperty.CheckIn;
    $scope.CheckOut_Date = SearchProperty.CheckOut;

    $scope.selectedRoom = "Avaliable Rooms";
    $scope.dropboxroomselected = function (room) {
        $scope.selectedRoom = room.Room_Name;
        Room = room;
        $scope.CheckedRoom[count++] = room;
        total += Room.Room_Price;
        $scope.message = total;
    };

    $scope.CheckAvailable = function (checkInDate, checkOutDate) {
        $scope.BookedRoom = [];
        PropertyApi.getProperty(BookedProperty.Property.Property_ID).then(function (response) {
            BookedProperty.Property = response.data;
            $scope.AvailiableRooms = BookedProperty.Property.Rooms;

            var i;
            for (room in $scope.BookingRecordDetails) {
                var startDate = new Date($scope.BookingRecordDetails[room].CheckIn_Date);
                var endDate = new Date($scope.BookingRecordDetails[room].CheckOut_Date);
                if (((checkInDate <= startDate && checkOutDate >= startDate && checkOutDate <= endDate) ||
                    (checkInDate >= startDate && checkInDate <= endDate && checkOutDate >= startDate && checkOutDate <= endDate) ||
                    (checkInDate >= startDate && checkInDate <= endDate && checkOutDate >= endDate && checkOutDate >= startDate))
                    && $scope.BookingRecordDetails[room].Property_ID == BookedProperty.Property.Property_ID) {
                    $scope.BookedRoom.push($scope.BookingRecordDetails[room]);
                }
            }

            for (i = 0; i < $scope.BookedRoom.length; i++) {
                for (var j = 0; j < $scope.AvailiableRooms.length; j++) {
                    if ($scope.BookedRoom[i].Room_ID == $scope.AvailiableRooms[j].Room_ID) {
                        var index = $scope.AvailiableRooms.indexOf($scope.AvailiableRooms[j]);
                        if (index > -1) {
                            $scope.AvailiableRooms.splice(index, 1);
                        }
                    }
                }
            }
        }, onFailure);   
    };
    
    $scope.addBooking = function () {

        if ($scope.Client_email != null) {

            var email = $scope.Client_email;
            email = email.replace("dot", ".");

            var bookingToAdd = {
                'BookingRecord_ID': $scope.BookingRecord_ID,
                'Client_email': email,
                'Client_FirstName': $scope.Client_FirstName,
                'Client_LastName': $scope.Client_LastName,
                'Card_Number': $scope.Card_Number
            };

            BookingApi.addBookingRecord(bookingToAdd).then(function (response) {
                var i;
                var rooms;
                for (i = 0; i < $scope.CheckedRoom.length; i++) {
                    var bookingDetailToAdd = {
                        'BookingRecordDetail_ID': $scope.BookingRecordDetails.length + 1 + i,
                        'CheckIn_Date': $scope.CheckIn_Date,
                        'CheckOut_Date': $scope.CheckOut_Date,
                        'Purchase_Amount': $scope.CheckedRoom[i].Room_Price,
                        'Room_ID': $scope.CheckedRoom[i].Room_ID,
                        'Property_ID': BookedProperty.Property.Property_ID,
                        'BookingRecord_ID': $scope.BookingRecord_ID
                    };
                    rooms += $scope.CheckedRoom[i].Room_Name + ', ' + $scope.CheckedRoom[i].Room_Price + 'Check In:' + $scope.CheckIn_Date + ' Check Out:' + $scope.CheckIn_Date + ',';

                    BookingApi.addBookingRecordDetail(bookingDetailToAdd).then(function (response) {
                        if (i == $scope.CheckedRoom.length) {
                            BookingApi.getBookingRecord($scope.BookingRecord_ID).then(function (response) {
                                BookedProperty.Record = response.data;
                                window.location.href = "http://localhost:11958/#!/ManageBook";
                            }, function (reason) { alert("record does not exist") });
                        }
                    }, onFailure)
                };
                var emailBody = 'Your reservation number is:' + $scope.BookingRecord_ID + ', you have booked the following rooms at ' + BookedProperty.Property.Property_Name + ' ' + rooms;

                var emailToSend = {
                    'FirstName': $scope.Client_FirstName,
                    'LastName': $scope.Client_LastName,
                    'EmailTo': email,
                    'Subject': 'Reservation Confirmation',
                    'Body': emailBody //email template
                };

                EmailApi.sendEmail(emailToSend).then(function (response) { alert('Email has been sent') }, onFailure)
                alert("Reservation successfull");
            }, onFailure);
        }
        else {
            alert("enter email address");
        }
    };
});

mainApp.controller("GetRecordController", function ($scope, BookingApi, BookedProperty) {

    $scope.getRecord = function() {
        BookingApi.getBookingRecord($scope.Record_ID).then(function (response) {
            BookedProperty.Record = response.data;
            alert("Record found");
            window.location.href = "http://localhost:11958/#!/ManageBook";
        }, function (reason) { alert("record does not exist") })
    };
});

mainApp.controller("UpdateBookingController", function ($scope, BookingApi, BookedProperty, LoggedIn) {

    $scope.Detail = [];
    var count = 0;
    var total = 0;

    $scope.Record = BookedProperty.Record;

    if (LoggedIn.Client.Client_email != null) {
        $scope.LoggedIn = true;
    }

    if ($scope.Record.Card_Number != null) {
        $scope.Paid = true;
        $scope.message = "Reservation fully paid";
    }
    else {
        for (room_price in $scope.Record.BookingRecordDetails) {

            total += $scope.Record.BookingRecordDetails[room_price].Purchase_Amount;
        }
        $scope.message = "Total Payment: " + total;
    }

    var onFailure = function (reason) { $scope.error = reason };

    getBookingRecordDetails();
    function getBookingRecordDetails() {
        BookingApi.getBookingRecordDetails().then(function (response) {
            $scope.RecordDetails = response.data;
            for (record in $scope.RecordDetails) {
                if ($scope.RecordDetails[record].BookingRecord_ID == $scope.Record.BookingRecord_ID) {
                    $scope.Detail[count++] = $scope.RecordDetails[record];
                }
            }
        }, onFailure);
    };

    getCardTypes();
    function getCardTypes() {
        BookingApi.getCardTypes().then(function (response) {
            $scope.CardTypes = response.data
        }, onFailure);
    };

    $scope.selectedCard = "Select Card Type";
    $scope.dropboxcardselected = function (CardType) {
        $scope.selectedCard = CardType.Type_Description;
        $scope.CardType = CardType;
    };

    $scope.RemoveDetail = function (detail) {
        var index = $scope.Detail.indexOf(detail);
        BookingApi.deleteBookingRecordDetail(detail).then(function (response) {
            alert("Item removed");
            $scope.Detail.splice(index, 1);
        }, onFailure);
    };

    $scope.RemoveRecord = function () {
        for (detail in $scope.Detail) {
            BookingApi.deleteBookingRecordDetail($scope.Detail[detail]).then(function (response) { }, onFailure);
        }
        BookingApi.deleteBookingRecord($scope.Record).then(function (response) {
            alert("Reservation removed"); window.location.href = "http://localhost:11958/"
        }, onFailure);
    };

    $scope.saveCard = function () {
        var cardToAdd = {
            'Card_Number': $scope.Card_Number,
            'CVC_Code': $scope.CVC_Code,
            'Exp_date': $scope.Exp_date,
            'CardType_ID': $scope.CardType.CardType_ID,
            'Client_email': LoggedIn.Client.Client_email
        }
        BookingApi.addCard(cardToAdd).then(function (response) { alert("Card has been saved"); window.location.href = "http://localhost:11958/#!/Home" }, function (reason) { $scope.error = reason });
    };

    $scope.makePayment = function () {
        var recordToUpdate = {
            'BookingRecord_ID': $scope.Record.BookingRecord_ID,
            'Client_email': $scope.Record.Client_email,
            'Client_FirstName': $scope.Record.Client_FirstName,
            'Client_LastName': $scope.Record.Client_LastName,
            'Card_Number': $scope.Card_Number
        };
        BookingApi.editBookingRecord(recordToUpdate).then(function (response) { alert("Reservation has been paid") }, function (reason) { $scope.error = reason });
    };
});

//Reviews
mainApp.controller("ReviewController", function ($scope, ReviewApi, BookedProperty, LoggedIn) {

    if (LoggedIn.Client.Client_email != null) {
        $scope.LoggedIn = true;
    }

    $scope.Property = BookedProperty.Property;

    var onSuccess = function (response) {
        $scope.Reviews = response.data
        for (review in $scope.Reviews) {
            $scope.Reviews[review].Client_email = $scope.Reviews[review].Client_email.replace("dot",".")
        }
    }

    var onFailure = function (reason) { $scope.error = reason }

    getReviews();
    function getReviews() {
        ReviewApi.getReviews().then(onSuccess, onFailure);
    };

    $scope.addReview = function () {
        var reviewToAdd = {
            'Review_ID': $scope.Reviews.length+1,
            'Review_Rating': $scope.Review_Rating,
            'Review_Description': $scope.Review_Description,
            'Client_email': LoggedIn.Client.Client_email,
            'Property_ID': BookedProperty.Property.Property_ID
        };

        ReviewApi.addReview(reviewToAdd).then(function (response) { alert("Review added"); window.location.reload(); }, function (reason) { $scope.error = reason })
    }
});

//Search
mainApp.controller("SearchController", function ($scope,PropertyApi, SearchProperty) {

    var onSuccess = function (response) {
        SearchProperty.Properties = response.data;
        SearchProperty.Text = $scope.searchText;
        SearchProperty.CheckIn = $scope.Check_in;
        SearchProperty.CheckOut = $scope.Check_out;
        SearchProperty.People = $scope.People;
        window.location.href = "http://localhost:11958/#!/Search";
    };

    var onFailure = function (reason) { $scope.error = reason };

    $scope.Search = function () {
        PropertyApi.searchProperties($scope.searchText).then(onSuccess, onFailure);        
    }
});

mainApp.controller("ViewResultsController", function ($scope, SearchProperty, BookedProperty, PropertyApi) {

    var onSuccess = function (response) {
        $scope.Property = response.data;
        BookedProperty.Property = $scope.Property;
        window.location.href = "http://localhost:11958/#!/Book";
    }

    var onFailure = function (reason) { $scope.error = reason }

    $scope.Result = SearchProperty.Properties;
    $scope.searchText = SearchProperty.Text;
    $scope.Check_in = SearchProperty.CheckIn;
    $scope.Check_out = SearchProperty.CheckOut;
    $scope.People = SearchProperty.People;


    $scope.onUpdate = function () {
        for (var i = $scope.Result.length; i > -1; i--) {
            $scope.Result.splice(0,1);
        }
        PropertyApi.searchProperties($scope.searchText).then(function (response) {
            for (property in response.data) {
                $scope.Result.push(response.data[property])
            }
            SearchProperty.Properties = $scope.Result;
        }, onFailure);
    }

    $scope.Book = function (Property_ID) {
        PropertyApi.getProperty(Property_ID).then(onSuccess, onFailure);
    };
});