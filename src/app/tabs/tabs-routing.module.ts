import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'timer',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./timer/timer.module').then(m => m.TimerPageModule)
          }
        ]
      },
      // {
      //   path: 'analytics',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('./analytics/analytics.module').then(m => m.AnalyticsPageModule)
      //     }
      //   ]
      // },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./settings/settings.module').then(m => m.SettingsModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/timer',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/timer',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
