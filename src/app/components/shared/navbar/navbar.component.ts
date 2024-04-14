import {Component, inject, input, Input, OnInit} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";

export enum ItemsJustification {
  center = 'justify-content-center',
  end = 'justify-content-end',
  start = 'justify-content-start',
  between = 'justify-content-between',
  around = 'justify-content-around',
  evenly = 'justify-content-evenly'
}

export class NavBarItem {
  title: string = "";
  routerLink: string = "";
  href: string = "";
  bootstrapIconClasses: string = "";
  iconInLeftOfTitle: boolean = false;
  onClick: Function | undefined = undefined;
}

@Component({
  selector: 'rr-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private offcanvasService: NgbOffcanvas = inject(NgbOffcanvas);
  @Input() showBrand: boolean = false;
  @Input() centerNavbar: boolean = false;
  @Input() floatingNavbar: boolean = false;
  @Input() collapse: boolean = false;
  @Input() fullWidth: boolean = true;
  @Input() navBarItems: NavBarItem[] = [];
  @Input() itemsJustification: ItemsJustification = ItemsJustification.between;
  @Input() backgroundColor: string = "";
  @Input() itemsColor: string = "";
  @Input() itemsTitleFontSize: string = "";
  @Input() itemsIconFontSize: string = "";
  @Input() positionClasses: string = "fixed-top";

  ngOnInit(): void {
  }

  handleClick(onClickFn: Function | undefined): void {
    if (onClickFn) {
      onClickFn();
    }
  }

  onClickCollapsedNav(content: any) {
    this.offcanvasService.open(content, {position: "end", panelClass: 'bg-dark text-light'});
  }

  onClickOffcanvasLink($event: any) {
    $event.preventDefault();
    this.offcanvasService.dismiss();
  }
}
