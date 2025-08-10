self.addEventListener('message', function (event) {
  const data = event.data;
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || 'favicon.ico',
  });
});
