import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { X, Upload, Camera } from "lucide-react";

export default function EmployeesPage() {
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  return (
    <div>
      {isAddingEmployee ? (
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Novi zaposlenik</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAddingEmployee(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Osnovne informacije</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ime</Label>
                    <Input id="firstName" placeholder="Unesite ime" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Prezime</Label>
                    <Input id="lastName" placeholder="Unesite prezime" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oib">OIB</Label>
                  <Input id="oib" placeholder="Unesite OIB (11 znamenki)" maxLength={11} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Datum rođenja</Label>
                  <Input id="birthDate" type="date" />
                </div>

                <div className="space-y-2">
                  <Label>Kontakt podaci</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="+385" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+385">+385</SelectItem>
                          <SelectItem value="+386">+386</SelectItem>
                          <SelectItem value="+387">+387</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input placeholder="Unesite kontakt broj" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email adresa</Label>
                  <Input id="email" type="email" placeholder="Unesite email adresu" />
                </div>
              </div>

              {/* Right Column - Address & Documents */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Dokumenti</h3>
                  <div className="p-4 border-2 border-dashed rounded-lg text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Kliknite da dodate ili prevucite u ovo polje
                      </p>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Priloži fotografiju
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Slika profila</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <Button variant="outline" size="sm">
                      Priloži fotografiju
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Adresa</Label>
                  <Input placeholder="Unesite adresu" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Poštanski broj</Label>
                    <Input placeholder="Unesite poštanski broj" />
                  </div>
                  <div className="space-y-2">
                    <Label>Država</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Odaberite državu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Hrvatska</SelectItem>
                        <SelectItem value="si">Slovenija</SelectItem>
                        <SelectItem value="ba">Bosna i Hercegovina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={() => setIsAddingEmployee(false)}>
              Odustani
            </Button>
            <Button>Spremi</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Employees</h1>
            <Button onClick={() => setIsAddingEmployee(true)}>
              Add New Employee
            </Button>
          </div>

          {/* Employee List will go here */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Add employee list table here */}
          </div>
        </div>
      )}
    </div>
  );
} 