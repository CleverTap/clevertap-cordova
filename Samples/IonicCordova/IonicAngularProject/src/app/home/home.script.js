window.addEventListener('batterystatus', onBatteryStatus, false);

function onBatteryStatus(info) {
  alert('BATTERY STATUS\nLevel: ' + info.level + '%\nisPlugged: ' + info.isPlugged);
}

const B1 = document.getElementById('button 1');

B1.addEventListener('click', clickMethod, false);

function clickMethod()
{
  const alert = document.createElement('ion-alert');
  alert.cssClass = 'my-custom-class';
  alert.header = 'Alert';
  alert.subHeader = 'An alert you made';
  alert.message = 'This is an alert message.';
  alert.buttons = ['Let\'s get to it, then', 'Let\'s do this!'];

  document.body.appendChild(alert);
  return alert.present();
}
