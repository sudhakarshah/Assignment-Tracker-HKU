chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
      // Create notification
      chrome.notifications.create(request.key, {
              type: 'basic',
              iconUrl: 'icon128.png',
              title: request.title,
              message: request.name,
           }, (notificationId) => {});

    sendResponse({returnMsg: "done"});
  });
