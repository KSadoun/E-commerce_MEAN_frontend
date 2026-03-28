import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { AdminSidebar } from "../sidebar/sidebar";
import { AdminNavbar } from "../navbar/navbar";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminNavbar, AdminSidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class AdminLayout {}
