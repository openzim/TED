
window.onload = function() {
  setupLanguageFilter();
  setupPagination();

  // Load the initial data. 
  // This will display all data without any language filter.
  videoDB.loadData(undefined, function() {
    var data = videoDB.getPage(videoDB.getPageNumber());
    refreshVideos(undefined, data);
  });

  refreshPagination();
  return false;
};

/** 
 * Apply a language filter, that is selected by the
 * drop down options <select> menu. 
 * This will then only display items that have
 * subtitles in the selected language.
 */
function setupLanguageFilter() {
  $('.chosen-select').chosen({width: "380px"}).change(function(){
    language = arguments[1].selected;

    // If 'lang-all' is selected the user wants to
    // display videos in all languages. 
    // This removes the previously set filter (if any).
    if (language == 'lang-all') {
      language = undefined;
    }

    // Load the data for the selected language and 
    // generate the video list.
    videoDB.resetPage();
    videoDB.loadData(language, function() {
      var data = videoDB.getPage(videoDB.getPageNumber());
      refreshVideos(language, data);
      refreshPagination();
    });
  });
}

/**
* This function handles the pagination:
* Clicking the back and forward button.
*/
function setupPagination() {

    function handlePagination(){
	var data = videoDB.getPage(videoDB.getPageNumber());
	refreshVideos(undefined, data);
	refreshPagination();
	window.scrollTo(0, 0);
    }

    for (var i = 0 ; i<2 ; i++) {
	var leftArrow = document.getElementsByClassName('left-arrow')[i];
	var rightArrow = document.getElementsByClassName('right-arrow')[i];
	
	leftArrow.onclick = function() {
	    videoDB.pageBackwards(function() {
		handlePagination();
	    });
	}
	
	rightArrow.onclick = function() {
	    videoDB.pageForward(function(){
		handlePagination();
	    });
	}
    }
}

/**
 * Reset the page text on the pagination widget, 
 * if a new language has been applied.
 */
function refreshPagination() {
    var pageCount = videoDB.getPageCount();

    for (var i = 0 ; i<2 ; i++) {
	var pageBox = document.getElementsByClassName('pagination')[i];
	var leftArrow = document.getElementsByClassName('left-arrow')[i];
	var rightArrow = document.getElementsByClassName('right-arrow')[i];
	
	if (pageCount > 1) {
	    var pageText = document.getElementsByClassName('pagination-text')[i];
	    var pageNumber = videoDB.getPageNumber();
	    pageText.innerHTML = 'Page ' + pageNumber + '/' + pageCount;
	    
	    if (videoDB.getPageNumber() == 1) {
		leftArrow.style.visibility = 'hidden';
		rightArrow.style.visibility = 'visible';
	    } else if (pageNumber == pageCount) {
		leftArrow.style.visibility = 'visible';
		rightArrow.style.visibility = 'hidden';	
	    } else {
		leftArrow.style.visibility = 'visible';
		rightArrow.style.visibility = 'visible';	
	    }
	    
	    pageBox.style.visibility = 'visible';
	} else {
	    pageBox.style.visibility = 'hidden';
	    leftArrow.style.visibility = 'hidden';
	    rightArrow.style.visibility = 'hidden';	
	}
    }
}

/**
 * Dynamically generate the video item out of 
 * the passed in {pageData} parameter.
 * @param {pageData} Video data for the current page.
 */
function refreshVideos(language, pageData) {
    var videoList = document.getElementById('video-items');
    videoList.innerHTML = '';
    for (i in pageData) {
      var video = pageData[i];
      var lang = undefined;
      idx = 0;
      for (j in video.title) {
        if (video.title[j].lang == language) {
          idx = j;
          lang = language;
        }
      }
      var li = document.createElement('li');
      
      var a = document.createElement('a')
      a.href =  video['id']+'.html?lang=' + lang;
      a.className = 'nostyle'

      var img = document.createElement('img');
      img.src = ZIM_IMG_NS+'videos/'+video['id']+'/thumbnail.jpg';

      var author = document.createElement('p');
      author.id = 'author';
      author.innerHTML = video['speaker'];
      
      var title = document.createElement('p');
      title.id = 'title';
      title.innerHTML = video['title'][idx].text;

      a.appendChild(img);
      a.appendChild(author);
      a.appendChild(title);
      li.appendChild(a);
      videoList.appendChild(li);
    }
}
