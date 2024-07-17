import { ComponentRef, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { SurveyBaseType, SurveyRefData } from "../../util/type/survey-type";
import { CreateSurveyGroupComponent } from "../../shared/feature/create-survey-group/create-survey-group.component";

@Injectable({
  providedIn: 'root'
})
export class SurveyDataStorageService {
  private dataStorageSubject = new BehaviorSubject<SurveyRefData[]>([]);
  data$ = this.dataStorageSubject.asObservable();

  addData(surveyData: SurveyRefData) {
    const currentDatas = this.dataStorageSubject.value;
    this.dataStorageSubject.next([...currentDatas, surveyData])
  }

  updateData(ref: ComponentRef<CreateSurveyGroupComponent>, state: SurveyRefData) {
    const updatedData = this.dataStorageSubject.value.map(current => {
      return current.ref === ref ? { ...current, data: state.data } : current;
    });
    this.dataStorageSubject.next(updatedData);
  }

  removeData(ref: ComponentRef<CreateSurveyGroupComponent>) {
    const filteredData = this.dataStorageSubject.value.filter(current => current.ref !== ref);
    this.dataStorageSubject.next(filteredData);
  };

  getData$(): Observable<SurveyBaseType[]> {
    return this.data$.pipe(map(data => data.map(d => d.data)))
  }
}
