'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Search, X, User, Filter } from 'lucide-react'
import { usePlanesEstudioFiltrosContext } from '@/contexts/PlanesEstudioFiltrosContext'

export function SeccionFiltros() {
  const {
    isLoggedIn,
    showFilters,
    setShowFilters,
    filtersPlan,
    filtroEstadoHabilitado,
    aniosDisponiblesFiltro,
    estadosMateriasDisponiblesFiltro,
    cantidadFiltrosActivos,
    hasActiveFilters,
    handleFilterYearChange,
    handleFilterCuatrimestreChange,
    handleSearchTermChange,
    handleFilterCorrelativaChange,
    handleFilterStatusChange,
    handleFilterHoursChange,
    handleShowMateriaStatusChange,
    handleShowCorrelativesChange,
    handleClearAllFilters,
    initialPlanFilters,
  } = usePlanesEstudioFiltrosContext()

  const getWarningFilterEstadoMateriaUsuario = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex items-center gap-1 mt-1">
          <User className="h-3 w-3 text-amber-600" />
          <span className="text-xs text-amber-600">Inicia sesión para filtrar por estado</span>
        </div>
      )
    } else if (!filtroEstadoHabilitado) {
      return (
        <div className="flex items-center gap-1 mt-1">
          <User className="h-3 w-3 text-amber-600" />
          <span className="text-xs text-amber-600">
            No se puede filtrar por estado ya que no esta cargada como carrera en tu cuenta
          </span>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="pt-6">
        {/* Botones de Filtros */}
        <div className="flex justify-end gap-2 mt-4">
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearAllFilters}
              className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar Todos los Filtros
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            style={{ width: '200px' }}
            className={`bg-white hover:bg-gray-50 border-gray-300 ${hasActiveFilters ? 'text-blue-700 border-blue-300' : 'text-gray-700'}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                {cantidadFiltrosActivos}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="mt-4 pt-4 grid border-t border-gray-200 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-300">
            {/* Search by Name/Code */}
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="col-span-1 sm:col-span-2 md:col-span-2">
                <Label htmlFor="nombreMateria-term" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Materia
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="nombreMateria-term"
                    placeholder="Nombre materia"
                    value={filtersPlan.nombreMateria}
                    onChange={(e) => handleSearchTermChange(e.target.value)}
                    className="pl-9 bg-white border-gray-300"
                  />
                  {filtersPlan.nombreMateria && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:bg-transparent"
                      onClick={() => handleSearchTermChange('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Filter by Year */}
            <div>
              <Label htmlFor="filter-anioCursada" className="block text-sm font-medium text-gray-700 mb-2">
                Año
              </Label>
              <Select value={filtersPlan.anioCursada} onValueChange={handleFilterYearChange}>
                <SelectTrigger id="filter-anioCursada" className="bg-white border-gray-300">
                  <SelectValue placeholder="Todos los años" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value={initialPlanFilters.anioCursada}>Todos los años</SelectItem>
                  {aniosDisponiblesFiltro.map((anioCursada) => (
                    <SelectItem key={anioCursada} value={anioCursada.toString()}>
                      {anioCursada}° Año
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Cuatrimestre */}
            <div>
              <Label htmlFor="filter-cuatrimestreCursada" className="block text-sm font-medium text-gray-700 mb-2">
                Cuatrimestre
              </Label>
              <Select value={filtersPlan.cuatrimestreCursada} onValueChange={handleFilterCuatrimestreChange}>
                <SelectTrigger id="filter-cuatrimestreCursada" className="bg-white border-gray-300">
                  <SelectValue placeholder="Todos los cuatrimestres" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value={initialPlanFilters.cuatrimestreCursada}>Todos los cuatrimestres</SelectItem>
                  <SelectItem value="0">Anual</SelectItem>
                  <SelectItem value="1">1° Cuatrimestre</SelectItem>
                  <SelectItem value="2">2° Cuatrimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Hours */}
            <div>
              <Label htmlFor="filter-horasSemanales" className="block text-sm font-medium text-gray-700 mb-2">
                Horas Semanales
              </Label>
              <Input
                id="filter-horasSemanales"
                type="number"
                placeholder="Ej: 4"
                value={filtersPlan.horasSemanales}
                onChange={(e) => handleFilterHoursChange(e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>

            {/* Fila - Filtros Correlativa */}
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Search by Name/Code Correlativa*/}
              <div className="col-span-1">
                <Label htmlFor="nombreMateria-correlativa" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Correlativa
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="nombreMateria-correlativa"
                    placeholder="Nombre de la materia correlativa"
                    value={filtersPlan.nombreCorrelativa}
                    onChange={(e) => handleFilterCorrelativaChange(e.target.value)}
                    className="pl-9 bg-white border-gray-300"
                  />
                  {filtersPlan.nombreCorrelativa && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:bg-transparent"
                      onClick={() => handleFilterCorrelativaChange('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Toggle Show Materia Correlativas */}
              <div className="col-span-1 flex flex-col justify-end">
                <div className="flex items-center space-x-2 h-10">
                  <Switch
                    id="show-correlatives"
                    checked={filtersPlan.showCorrelativasMateria}
                    onCheckedChange={handleShowCorrelativesChange}
                  />
                  <Label htmlFor="show-correlatives" className="text-gray-700">
                    Mostrar Correlativas
                  </Label>
                </div>
              </div>
            </div>

            {/* Fila - Filtros Estado Materia */}
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Filter by Status */}
              <div className="col-span-1">
                <Label htmlFor="filter-estadoMateriaUsuario" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                  {getWarningFilterEstadoMateriaUsuario()}
                </Label>
                <Select
                  value={filtersPlan.estadoMateriaUsuario}
                  onValueChange={handleFilterStatusChange}
                  disabled={!filtroEstadoHabilitado}
                >
                  <SelectTrigger id="filter-estadoMateriaUsuario" className="bg-white border-gray-300">
                    <SelectValue placeholder={!isLoggedIn ? 'Requiere autenticación' : 'Todos los estados'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value={initialPlanFilters.estadoMateriaUsuario}>Todos los estados</SelectItem>
                    {estadosMateriasDisponiblesFiltro.map((estadoMateriaUsuario) => (
                      <SelectItem key={estadoMateriaUsuario} value={estadoMateriaUsuario}>
                        {estadoMateriaUsuario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Toggle Show Materia Status */}
              <div className="col-span-1 flex flex-col justify-end">
                <div className="flex items-center space-x-2 h-10">
                  <Switch
                    id="show-estadoMateriaUsuario"
                    checked={filtersPlan.showEstadoMateriaUsuario}
                    onCheckedChange={handleShowMateriaStatusChange}
                    disabled={!filtroEstadoHabilitado}
                  />
                  <Label htmlFor="show-estadoMateriaUsuario" className="text-gray-700">
                    Mostrar Estado de Materia
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
