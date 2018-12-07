/*

*/
var DELAY = 0;
var presURL = "";


/*
Restart alarm for the currently active tab, whenever background.js is run.
*/
var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
gettingActiveTab.then((tabs) => {
  restartAlarm(tabs[0].id);
});

/*
Restart alarm for the currently active tab, whenever the user navigates.
*/
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) {
    return;
  }
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    if (tabId == tabs[0].id) {
      restartAlarm(tabId);
    }
  });
});

/*
Restart alarm for the currently active tab, whenever a new tab becomes active.
*/
browser.tabs.onActivated.addListener((activeInfo) => {
  restartAlarm(activeInfo.tabId);
});

/*
restartAlarm: clear all alarms,
then set a new alarm for the given tab.
select replace part based on current url
*/
function restartAlarm(tabId) {
  browser.pageAction.hide(tabId);
  browser.alarms.clearAll();
  var gettingTab = browser.tabs.get(tabId);
  gettingTab.then((tab) => {
    if (tab.url.includes("#browse")) {
      browser.alarms.create("", {delayInMinutes: DELAY});
      var lastamper = tab.url.lastIndexOf("&");
      if (lastamper > 87){
        var midurl = tab.url.substr(0,lastamper);
      } else {
        var midurl = tab.url;
      }
      // var newURL = tab.url.replace("#browse","#prop");
          var newURL = midurl.replace("#browse","#prop");
      console.log(newURL)    
      presURL = newURL;
    }else if (tab.url.includes("#prop")){
      browser.alarms.create("", {delayInMinutes: DELAY});
      var lastamper = tab.url.lastIndexOf("&");
      if (lastamper > 87){
        var midurl = tab.url.substr(0,lastamper);
      } else {
        var midurl = tab.url;
      }
      // var newURL = tab.url.replace("#prop","#browse");
      var newURL = midurl.replace("#prop","#browse");
      console.log(newURL)    
      presURL = newURL;
    }else {
        //pass
}
  });
}



/*
On alarm, show the page action.
*/
browser.alarms.onAlarm.addListener((alarm) => {
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    browser.pageAction.show(tabs[0].id);
  });
});

/*
On page action click, navigate the corresponding tab to the cat gifs.
*/
browser.pageAction.onClicked.addListener(() => {
  browser.tabs.update({url: presURL});
});
