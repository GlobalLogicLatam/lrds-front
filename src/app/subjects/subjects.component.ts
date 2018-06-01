import { Component, OnInit, Input } from '@angular/core';
import { SubjectService, AlertService } from '../_services';
import { Subject } from '../_models';

@Component({
  selector: 'subjects',
  templateUrl: './subjects.component.html'
})
export class SubjectsComponent implements OnInit {
  @Input() subjects: Subject[];
  constructor() { }

  ngOnInit() { }

}
