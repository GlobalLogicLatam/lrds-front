import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { SubjectService } from '../_services/subject.service';
import { Subject } from '../_models/subject';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;
    subjects: Subject[] = [];

    constructor(private userService: UserService, private subjectService: SubjectService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.subjects = JSON.parse(localStorage.getItem('subjects'));
    }

    ngOnInit() {
        this.loadAllSubjects();
    }

    deleteSubject(id: number) {
        this.subjectService.delete(id).subscribe(() => { this.loadAllSubjects() });
    }

    private loadAllSubjects() {
        this.subjectService.getAll().subscribe(subjects => { this.subjects = subjects; });
    }
}