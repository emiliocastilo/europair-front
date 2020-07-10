import { Injectable, ElementRef } from '@angular/core';
import { ModalOptions } from 'materialize-css';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalInstance: M.Modal;

  constructor() {}

  public initializeModal(
    modalComponentRef: ElementRef,
    modalOptions: Partial<ModalOptions>
  ) {
    if (this.modalInstance) {
      this.modalInstance.destroy();
    }
    // Materialize needs the div element ref inside the modal component
    this.modalInstance = M.Modal.init(
      modalComponentRef.nativeElement.firstChild,
      modalOptions
    );
  }

  public openModal() {
    this.modalInstance.open();
  }

  public closeModal() {
    this.modalInstance.close();
  }

  public destroyModal() {
    this.modalInstance.destroy();
  }
}
