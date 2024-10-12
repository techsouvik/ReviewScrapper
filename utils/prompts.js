const generate_promptForFindingSelectors = (url,html,metadata) => `
Analyze the following HTML in array of html and return Most accurate CSS selectors by tag or class or id or any attribute for the following in JSON format:
  {
    reviewAll: {CSS selector for the review_container that contains all reviews in the page. this element should and mandatory to include or wrapped all reviews elements in page.},
    review: <most accurate CSS selector without above "reviewAll" selector for each review parent element which contains child elements of review details like title , body , author , etc .>,
    title: {most accurate  CSS selector for title element of each review in the page},
    body:  {most accurate CSS selector for body content element of each review in the page},
    rating:  {most accurate CSS selector for rating content element of each review in the page},
    reviewer:  {most accurate CSS selector for author of each review in the page},
    paginationNextBtn : {most accurate CSS selector for element that goto  next page of review check the css Selector in DOM and make sure it is unique for single element and searching this cssSelector the result should be one element if not RETRY to generate new one},
    totalPages : {Exact Number value of total count of page if available in webpage search inside container of pagination element find the max number page count if not availabe return number 0},
  }
And you should return only one CSS selector for each of the above mentioned fields.

From the HTML content ${html}    
From Metadata ${metadata}

if totalPages is not available or else 0 double check it from thr URL : ${url}
`;

module.exports = { generate_promptForFindingSelectors };


//reviewAll: <CSS selector for review_list or review_container that contains all reviews in the page. this element should and mandatory to include or wrapped all reviews elements in page.  >,
//review: <CSS selector without above "reviewAll" selector for each review parent element which contains child elements of review details like title , body , author , etc .>,
//title: <CSS selector for title element of each review in the page >,
//body:  <CSS selector for body content element of each review in the page >,
//rating:  <CSS selector for rating content element of each review in the page >,
//reviewer:  <CSS selector for author of each review in the page >,
//paginationNextBtn : <CSS selector for element that goto  next page of review check the css Selector in DOM and make sure it is unique for single element and searching this cssSelector the result should be one element if not RETRY to generate new one .  >,
//currentPageCounter : <CSS selector for pager list element for page 1 element by default ,ie it will be current highlighted page counter return number 0 >,
//paginationList : <CSS selector for parent element of {paginationBtn} , it wraps all the page counter in pagination list>,
//totalNoOfPages : <Number value of total count of page if available in webpage search inside container of pagination element find the max number page count if not availabe return number 0 >,
//popCloseBtnsArr : <Arr of string , value of strings will be CSS-SELECTOR for all the element with clickable or type action button to close the popup modal or any overlay window , i need this is array of string >