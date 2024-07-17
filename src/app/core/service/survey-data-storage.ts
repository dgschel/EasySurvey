import { ComponentRef } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { SurveyBaseType, SurveyRefData } from "../../util/type/survey-type";
import { CreateSurveyGroupComponent } from "../../shared/feature/create-survey-group/create-survey-group.component";

export class SurveyDataStorage {
  private dataSubject = new BehaviorSubject<SurveyRefData[]>([]);
  data$ = this.dataSubject.asObservable();

  addData(surveyData: SurveyRefData) {
    const currentDatas = this.dataSubject.value;
    this.dataSubject.next([...currentDatas, surveyData])
  }

  updateData(ref: ComponentRef<CreateSurveyGroupComponent>, state: SurveyRefData) {
    const updatedData = this.dataSubject.value.map(current => {
      return current.ref === ref ? { ...current, data: state.data } : current;
    });
    this.dataSubject.next(updatedData);
  }

  removeData(ref: ComponentRef<CreateSurveyGroupComponent>) {
    const filteredData = this.dataSubject.value.filter(current => current.ref !== ref);
    this.dataSubject.next(filteredData);
  };

  getData$(): Observable<SurveyBaseType[]> {
    return this.data$.pipe(map(data => data.map(d => d.data)))
  }
}
