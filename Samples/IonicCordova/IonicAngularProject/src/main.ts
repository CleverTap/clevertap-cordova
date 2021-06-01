import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

/*
window.addEventListener('batterystatus', onBatteryStatus, false);

function onBatteryStatus(info) {
  alert('BATTERY STATUS\nLevel: ' + info.level + '%\nisPlugged: ' + info.isPlugged);
}
Shifted to home.page.ts
function clickMethod(event)
{
  alert(event);
}
*/
