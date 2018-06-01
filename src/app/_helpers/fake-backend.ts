import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import { Subject } from '../_models';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // array in local storage for registered users
      const users: any[] = JSON.parse(localStorage.getItem('users')) || [];
      // array in local storage for subjects
      const subjects: any[] = JSON.parse(localStorage.getItem('subjects')) || this.seedSubjects();

      // wrap in delayed observable to simulate server api call
      return Observable.of(null).mergeMap(() => {

          // authenticate
          if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
              // find if any user matches login credentials
              let filteredUsers = users.filter(user => {
                  return user.username === request.body.username && user.password === request.body.password;
              });

              if (filteredUsers.length) {
                  // if login details are valid return 200 OK with user details and fake jwt token
                  let user = filteredUsers[0];
                  let body = {
                      id: user.id,
                      userName: user.userName,
                      firstname: user.firstName,
                      surname: user.lastName,
                      token: 'fake-jwt-token'
                  };

                  return Observable.of(new HttpResponse({ status: 200, body: body }));
              } else {
                  // else return 400 bad request
                  return Observable.throw('Username or password is incorrect');
              }
          }

          // get users
          if (request.url.endsWith('/api/users') && request.method === 'GET') {
              // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
              if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  return Observable.of(new HttpResponse({ status: 200, body: users }));
              } else {
                  // return 401 not authorised if token is null or invalid
                  return Observable.throw('Unauthorised');
              }
          }

          // get user by id
          if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
              // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
              if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  // find user by id in users array
                  let urlParts = request.url.split('/');
                  let id = parseInt(urlParts[urlParts.length - 1]);
                  let matchedUsers = users.filter(user => { return user.id === id; });
                  let user = matchedUsers.length ? matchedUsers[0] : null;

                  return Observable.of(new HttpResponse({ status: 200, body: user }));
              } else {
                  // return 401 not authorised if token is null or invalid
                  return Observable.throw('Unauthorised');
              }
          }

          // create user
          if (request.url.endsWith('/api/users') && request.method === 'POST') {
              // get new user object from post body
              let newUser = request.body;

              // validation
              let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
              if (duplicateUser) {
                  return Observable.throw('Username "' + newUser.username + '" is already taken');
              }

              // save new user
              newUser.id = users.length + 1;
              users.push(newUser);
              localStorage.setItem('users', JSON.stringify(users));

              // respond 200 OK
              return Observable.of(new HttpResponse({ status: 200 }));
          }

          // delete user
          if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
              // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
              if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  // find user by id in users array
                  let urlParts = request.url.split('/');
                  let id = parseInt(urlParts[urlParts.length - 1]);
                  for (let i = 0; i < users.length; i++) {
                      let user = users[i];
                      if (user.id === id) {
                          // delete user
                          users.splice(i, 1);
                          localStorage.setItem('users', JSON.stringify(users));
                          break;
                      }
                  }

                  // respond 200 OK
                  return Observable.of(new HttpResponse({ status: 200 }));
              } else {
                  // return 401 not authorised if token is null or invalid
                  return Observable.throw('Unauthorised');
              }
          }

          // get subjects
          if (request.url.endsWith('/api/subjects') && request.method === 'GET') {
              // check for fake auth token in header and return subjects if valid, this security is implemented server side in a real application
              if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  return Observable.of(new HttpResponse({ status: 200, body: subjects }));
              } else {
                  // return 401 not authorised if token is null or invalid
                  return Observable.throw('Unauthorised');
              }
          }

          // get subject by id
          if (request.url.match(/\/api\/subjects\/\d+$/) && request.method === 'GET') {
              // check for fake auth token in header and return subject if valid, this security is implemented server side in a real application
              if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  // find subject by id in subjects array
                  let urlParts = request.url.split('/');
                  let id = parseInt(urlParts[urlParts.length - 1]);
                  let matchedSubjects = subjects.filter(subject => { return subject.id === id; });
                  let subject = matchedSubjects.length ? matchedSubjects[0] : null;

                  return Observable.of(new HttpResponse({ status: 200, body: subject }));
              } else {
                  // return 401 not authorised if token is null or invalid
                  return Observable.throw('Unauthorised');
              }
          }

          // create subject
          if (request.url.endsWith('/api/subjects') && request.method === 'POST') {
              // get new subject object from post body
              let newSubject = request.body;

              // validation
              let duplicateSubject = subjects.filter(subject => { return subject.name === newSubject.name; }).length;
              if (duplicateSubject) {
                  return Observable.throw('Subject "' + newSubject.name + '" is already taken');
              }

              // save new Subject
              newSubject.id = subjects.length + 1;
              subjects.push(newSubject);
              localStorage.setItem('subjects', JSON.stringify(subjects));

              // respond 200 OK
              return Observable.of(new HttpResponse({ status: 200 }));
          }

          // delete subject
          if (request.url.match(/\/api\/subjects\/\d+$/) && request.method === 'DELETE') {
              // check for fake auth token in header and return Subject if valid, this security is implemented server side in a real application
              if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                  // find subject by id in subjects array
                  let urlParts = request.url.split('/');
                  let id = parseInt(urlParts[urlParts.length - 1]);
                  for (let i = 0; i < subjects.length; i++) {
                      let subject = subjects[i];
                      if (subject.id === id) {
                          // delete subject
                          subjects.splice(i, 1);
                          localStorage.setItem('subjects', JSON.stringify(subjects));
                          break;
                      }
                  }

                  // respond 200 OK
                  return Observable.of(new HttpResponse({ status: 200 }));
              } else {
                  // return 401 not authorised if token is null or invalid
                  return Observable.throw('Unauthorised');
              }
          }

          // pass through any requests not handled above
          return next.handle(request);

      })

      // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .materialize()
      .delay(500)
      .dematerialize();
  }

  private generateRandomDate() {
    const randomDate = Math.floor(+Date.now() + (Math.random() * 10 * 24 * 60 * 60 * 1000)); // random date from today to next 10 days.
    return new Date(randomDate);
  }

  private seedSubjects(): Subject[] {
    return [
      {
        id: 1,
        nombre: 'Análisis Matemático I',
        grado: 1,
        horario: '08:00',
        fecha: `${this.generateRandomDate()}`,
        inscripto: false
      },
      {
        id: 2,
        nombre: 'Álgebra y Geometría Analítica',
        grado: 1,
        horario: '08:00',
        fecha: `${this.generateRandomDate()}`,
        inscripto: false
      },
      {
        id: 3,
        nombre: 'Matemática Discreta',
        grado: 1,
        horario: '08:00',
        fecha: `${this.generateRandomDate()}`,
        inscripto: false
      },
      {
        id: 4,
        nombre: 'Sistemas y Organizaciones (Integradora)',
        grado: 1,
        horario: '08:00',
        fecha: `${this.generateRandomDate()}`,
        inscripto: false
      },
      {
        id: 5,
        nombre: 'Algoritmo y Estructuras de Datos',
        grado: 1,
        horario: '08:00',
        fecha: `${this.generateRandomDate()}`,
        inscripto: false
      },
      {
        id: 6,
        nombre: 'Arquitectura de Computadoras',
        grado: 1,
        horario: '08:00',
        fecha: `${this.generateRandomDate()}`,
        inscripto: false
      },
      {
        id: 7,
        nombre: 'Ingeniería y Sociedad',
        grado: 1,
        horario: '08:00',
        fecha: `${this.generateRandomDate()}`,
        inscripto: false
      },
      {
        id: 8,
        nombre: 'Química',
        grado: 1,
        horario: '08:00',
        fecha: `${this.generateRandomDate()}`,
        inscripto: false
      }
    ];
  }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
