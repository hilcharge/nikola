// Get the entry-content of the post

var full_entry_content = $("div.e-content");

var all_pages = []; // A list of all pages in the DOM

// Not needed: current_content = $("#pagination-content").html();// The full original content, to be replace with individual pages

var p_per_page = 10; // Should be parameterized somehow

// Store an array of each page of information, adjusting `current_page' object as needed
all_pages = paginateContent("div.e-content", p_per_page);
console.log("Pages: " + all_pages.length.toString());

// Add in a div for handling strictly the content
$("div.e-content").wrapInner('<div id="pagination-content"></div>');

// Add in pagination element at the top and bottom
full_entry_content.prepend('<div id="pagination-container-top"></div>');
full_entry_content.append('<div id="pagination-container-bottom"></div>');
var pagination_top = $("#pagination-container-top"); // The pagination-selector at the top of the pag
var pagination_bottom = $("#pagination-container-bottom"); // The pagination-selector at the bottom of page

num_pages = all_pages.length;

// Now we refresh the DOM

// setTimeout(function(){ console.log("Resetting DOM"); }, 0);


pagination_top.pagination({
   pages: num_pages,
   cssStyle: 'light-theme'});

pagination_bottom.pagination({
   pages: num_pages,
   cssStyle: 'light-theme'});
// Check the page has been explicitly provided in the link
anchor_target = window.location.href.split("#")[1];
if ( anchor_target ) {
    console.log("Anchor target: "+ anchor_target);
    pagenum = anchor_target.replace(/^page-([\d]+)$/, '\$1');
    if (pagenum) {
	console.log("Target page number: "+ pagenum);
	selectPage("#pagination-content", Number(pagenum));
    } else {
	// Start by displaying page number 1
	selectPage("#pagination-content", 1);
    }
} else {
   // If no anchor provided, load page 1
   // Start by displaying page number 1
    selectPage("#pagination-content", 1);
}

// When paginated portion is clicked, change the current page to the clicked one
$(document).on("click", ".page-link", function(){
    if (isNaN(this.text) ){
	// Use the href value to get the target page number
	// Note: had tried using $(this).closest("div") to get the parent pagination container,
	// but for some reason this was failing and returning 'undefined'
	// If the parent div ('#pagination-container-top' or '#pagination-container-bottom')
	// could be used, then the appropriate pagination('currentPage') property can be used
	// Since attempts to use this failed though, just using the href of the clicked element
	target_pagenum = Number(this.href.split("#")[1].split("-")[1]);
	selectPage( "#pagination-content", target_pagenum );
    } else {
	selectPage( "#pagination-content", Number(this.text) );
    }
});

// Change the pagination selectors, and also update the content
function selectPage( identifier, targetPage ) {
    console.log("Going to page: " + targetPage.toString());
    pagination_top.pagination('selectPage', targetPage);
    pagination_bottom.pagination('selectPage', targetPage);
    $(identifier).html( all_pages[ targetPage - 1 ]);    
}


function paginateContent( identifier, paragraphs_per_page ) {
    // Paginate content of the given 
    all_pages = [];
    page_i = 1;
    stored_paragraphs = 0;
    leftovers = [];
    console.log("Paginating: "+identifier);
    current_page = $('<div id="page-1"></div>');
    $(identifier).children().each( function() {
	// console.log("Found child " + $(this).prop('nodeName'));
	current_page.append($(this));
	// console.log("Current page:"+ current_page.html());
    	if ( $(this).prop('nodeName') == "P" ) {
    	    // Increase the count of stored paragraphs, until it meets the paragraphs per page count
    	    stored_paragraphs += 1;
    	    if ( stored_paragraphs % paragraphs_per_page == 0 ) {
		console.log("Turning the page")
    		// The page is complete. Prepend the page anchor
    		page_anchor = $('<a href="#page-' + page_i.toString() + '"/>');
    		current_page.prepend(page_anchor);
    		// Push the newly completed page into the list of all pages, and increment
    		all_pages.push(current_page);
    		page_i++;    
    		//console.log("Current page ("+page_i+"): "+current_page.html());
    		current_page = $('<div id="page-'+page_i.toString() +'"></div>');
    	    }
    	}	
    });
    // Check for stragglers in the final page which should be added into the last page
    // Add them into the final page
    non_p_closers = current_page.children(":not(p)");
    non_p_closers.each( function() {
	all_pages[ all_pages.length -1 ].append($(this));
    });
    return all_pages;
}
