import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { UserService } from '../../_services';
import { User } from '../../_models';
import { catchError, finalize } from 'rxjs/operators';

export class UserListDataSource extends DataSource<User> {

  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public dataCount = 0; 
  public itemsOnPage = 0;
  public loading$ = this.loadingSubject.asObservable();

  constructor (
    private readonly userService: UserService, 
    private readonly pageSize
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<readonly User[]> {
    return this.usersSubject.asObservable();
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {
    this.usersSubject.complete();
    this.loadingSubject.complete();
  }

  loadUsers(pageIndex = 0, pageSize = this.pageSize) {
    this.loadingSubject.next(true);
    this.usersSubject.subscribe();

    this.userService.getUsers(pageSize, pageIndex) 
      .pipe(
        catchError(() => of<{users: User[], count: number}>({users: [], count: 0})),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(({users, count}) => {
        this.itemsOnPage = users.length;
        this.dataCount = count;
        this.usersSubject.next([...users])
      });
  }
}
