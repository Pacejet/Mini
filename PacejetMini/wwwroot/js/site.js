$(document).ready(function(){

    $('#btnRunRate').click(function(){
        runRate();
    });

    fillCountry();
    
    $('#OriginCountry').change(function(){
        fillState($('#OriginState'),$(this).val());
    });

    $('#DestinationCountry').change(function(){
        fillState($('#DestinationState'),$(this).val());
    });        
    
    setTimeout(function(){
        $('#DestinationCountry, #OriginCountry').val('US');
        fillState($('#DestinationState'),'US');
        fillState($('#OriginState'),'US');
    }, 1000);
});
    
function fillCountry(){
    $('#DestinationCountry, #OriginCountry').html('<option>Select..</option>');
    $.get( "js/provinces.json",  function(e,x){
		var lookup = {};
		var items = e;
		var result = [];
		
		for (var item, i = 0; item = items[i++];) {
		  var name = item.country;
		
		  if (!(name in lookup)) {
		    lookup[name] = 1;
		    result.push(name);
		  }
		}
        result = result.sort(SortByName);
        $.each(result, function(i, o){
            $('#DestinationCountry, #OriginCountry').append('<option value=' + o + '>' + o + '</option>');
        });
    });
}

function fillState(stateList, country){
    stateList.html('<option>Select..</option>');
    $.get( "js/provinces.json",  function(e,x){
    
        $.each(e, function(i, o){
            if(o.country==country){
                stateList.append('<option value=' + o.short + '>' + o.name + '</option>');
            }
            
        });
    });
}

function SortByName(a, b){
  var aName = a.toLowerCase();
  var bName = b.toLowerCase(); 
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function runRate(){

    progressDialog.show('Retrieving rates...');

    //Payload to send to Pacejet's API
    var rateObject = {
		  "location": "",
		  "licenseID": "",
		  "upsLicenseID": "",
		  "origin": {
		    "companyName": "Company",
		    "address1": $('#OriginAddress1').val(),
		    "address2": $('#OriginAddress2').val(),
		    "address3": null,
		    "address4": null,
		    "address5": null,
		    "city": $('#OriginCity').val(),
		    "stateOrProvinceCode": $('#OriginState').val(),
		    "postalCode": $('#OriginPostal').val(),
		    "contactName": null,
		    "email": null,
		    "phone": null,
		    "urbanizationCode": null,
		    "countryCode": $('#OriginCountry').val(),
		    "residential": $('#OriginResidential').is(':checked'),
		    "locationType": null,
		    "locationSite": null,
		    "locationCode": null,
		    "taxIDNumber": null,
		    "taxIDType": null
		  },
		  "destination": {
		    "companyName": "Company",
		    "address1": $('#DestinationAddress1').val(),
		    "address2": $('#DestinationAddress2').val(),
		    "address3": null,
		    "address4": null,
		    "address5": null,
		    "city": $('#DestinationCity').val(),
		    "stateOrProvinceCode": $('#DestinationCity').val(),
		    "postalCode": $('#DestinationPostal').val(),
		    "contactName": null,
		    "email": null,
		    "phone": null,
		    "urbanizationCode": null,
		    "countryCode": $('#DestinationCountry').val(),
		    "residential": $('#DestinationResidential').is(':checked'),
		    "locationType": null,
		    "locationSite": null,
		    "locationCode": null,
		    "taxIDNumber": null,
		    "taxIDType": null
		  },
		  "packageDetailsList": [
		    {
		      "weight": $('#package_Weight').val(),
		      "dimensions": {
		        "length": $('#package_Weight').val(),
		        "width": $('#package_Weight').val(),
		        "height": $('#package_Weight').val(),
		        "units": "IN"
		      }
		    }
		  ]
		};

	$.ajax({
	type: "POST",
	url: 'http://api.pacejet.cc/Rates',
	headers: { 'PacejetLocation': '', 'PacejetLicenseKey': '' },
	contentType: "application/json",
	dataType: "json",
	data: JSON.stringify(rateObject),
	success: function (data) {
	    
        progressDialog.hide();
        setTimeout(function(){
            displayRates(data);
        }, 500);
	    
	},
	error: function (data, textStatus, errorThrown) {
	    console.log(data);
        progressDialog.hide();
	}
	});

}

function displayRates(data){
	var formatter = new Intl.NumberFormat('en-US', {
	  style: 'currency',
	  currency: 'USD',
	  minimumFractionDigits: 2,
	});
    
    if(data.ratingResultsList.length > 0){
        var tbl = "<table class='table table-striped'>";
        tbl += "<tr><th>Carrier</th><th>Rate</th></tr>";
        for(result of data.ratingResultsList){
            console.log(result.carrierNumber + " " + result.carrierClassOfServiceCode)
            tbl += "<tr><td>"+result.carrierNumber + " " + result.carrierClassOfServiceCode + "</td><td>" + formatter.format(result.consignorFreight) + "</td></tr>";
        }
        tbl += "</table>";
        showDialog("Rates", tbl);
    }
}

var progressDialog = progressDialog || (function ($) {
    'use strict';

    // Creating modal dialog's DOM
    var $dialog = $(
        '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:auto;">' +
        '<div class="modal-dialog modal-m">' +
        '<div class="modal-content">' +
            '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
            '<div class="modal-body">' +
                '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
            '</div>' +
        '</div></div></div>');

    return {
        /**
         * Opens our dialog
         * @param message Custom message
         * @param options Custom options:
         *                options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
         *                options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
         */
        show: function (message, options) {
            // Assigning defaults
            if (typeof options === 'undefined') {
                options = {progress: true, body: ''};
            }
            if (typeof message === 'undefined') {
                message = 'Loading';
            }
            var settings = $.extend({
                dialogSize: 'm',
                progressType: '',
                onHide: null // This callback runs after the dialog was hidden
            }, options);

            // Configuring dialog
            $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $dialog.find('h3').text(message);
            // Adding callbacks
            if (typeof settings.onHide === 'function') {
                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    settings.onHide.call($dialog);
                });
            }
            // Opening dialog
            $dialog.modal();
        },
        /**
         * Closes dialog
         */
        hide: function () {
            if($dialog)
                $dialog.modal('hide');
        }
    };

})(jQuery);


function showDialog(message, body){

	var $dialog = $(
	    '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:auto;">' +
	    '<div class="modal-dialog modal-m">' +
	    '<div class="modal-content">' +
	        '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 style="margin:0;"></h3></div>' +
	        '<div class="modal-body">' +
	            body +
	        '</div>' +
	        '<div class="modal-footer"><button type="button" class="btn btn-success" data-dismiss="modal">Close</button></div>' +
	    '</div>'+
	    '</div></div>');
	$dialog.find('h3').text(message);
	$dialog.modal();
}

function hideDialog(){
    $('.modal').modal('hide');
    setTimeout(function(){$('.modal').remove();},1000);
}