import { Component, OnInit } from '@angular/core';
import { SessionsService } from '../../repos/sessions.service';
import { from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-analytics',
  templateUrl: 'analytics.page.html',
  styleUrls: ['analytics.page.scss']
})
export class AnalyticsPage implements OnInit {
  sessions$;
  constructor(private sessionRepo: SessionsService) {}

  async ngOnInit() {
    this.sessions$ = from(this.sessionRepo.getItems())
      .pipe(
        catchError(err => of(`Woops, error occurred: ${err.message}`))
      );
  }
}
