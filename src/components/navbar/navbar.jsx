import React, { useState } from 'react';
import logo from '../../assets/images/logo emmusi.jpg';
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const toggleSubmenu = (menuName) => {
        setOpenSubmenu(prev => (prev === menuName ? null : menuName));
    };

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setOpenSubmenu(null);
    };

    const MenuGroup = ({ title, name, links }) => (
        <li className="relative w-full xl:w-auto text-center list-none">
            <button
                onClick={() => toggleSubmenu(name)}
                className="p-3 w-full xl:w-auto hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer font-semibold"
            >
                {title}
            </button>
            {(openSubmenu === name) && (
                <ul className="flex flex-col bg-white xl:absolute xl:top-full xl:left-0 shadow-md rounded-md mt-1 z-50 w-full xl:w-48 list-none">
                    {links.map(({ label, to }) => (
                        <li key={to} className="list-none">
                            <Link
                                to={to}
                                onClick={closeAllMenus}
                                className="block px-4 py-2 hover:bg-sky-100"
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );

    const menuItems = [
        {
            name: 'estudiantes',
            title: 'Estudiantes',
            links: [
                { label: 'Listar estudiantes', to: '/estudiantes/listaEstudiantes' },
                { label: 'Registrar estudiante', to: '/estudiantes/registro' },
            ],
        },
        {
            name: 'profesores',
            title: 'Profesores',
            links: [
                { label: 'Listar profesores', to: '/profesores/listaProfesores' },
                { label: 'Registrar profesor', to: '/formsProfesoresCursos/registro' },
            ],
        },
        {
            name: 'cursos',
            title: 'Cursos',
            links: [
                { label: 'Listar cursos', to: '/cursos/listaCursos' },
                { label: 'Registrar curso', to: '/formsProfesoresCursos/registro' },
            ],
        },
        {
            name: 'horarios',
            title: 'Horarios',
            links: [
                { label: 'Listar horarios', to: '/horarios/listaHorarios' },
                { label: 'Registrar horario', to: '/horarios/registro' },
            ],
        },
    ];

    return (
        <header className="relative flex justify-between items-center text-black py-6 px-8 md:px-32 bg-white drop-shadow-md z-50">
            <a href="/">
                <img src={logo} alt="Logo de la empresa" className="w-32 max-h-12 hover:scale-105 transition-all" />
            </a>

            {/* Menú para pantallas grandes */}
            <ul className="hidden xl:flex items-center gap-12 font-semibold text-base relative list-none">
                {menuItems.map((item) => (
                    <MenuGroup key={item.name} {...item} />
                ))}
            </ul>

            {/* Botón de menú móvil */}
            <i className="bx bx-menu xl:hidden block text-5xl cursor-pointer" onClick={() => setIsMenuOpen(prev => !prev)}></i>

            {/* Menú móvil */}
            <ul className={`xl:hidden fixed top-24 left-0 w-full bg-white flex flex-col items-center 
            gap-1 font-semibold text-lg transition-all z-50 px-4 py-2 list-none
            ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {menuItems.map((item) => (
                    <MenuGroup key={item.name} {...item} />
                ))}
            </ul>
        </header>
    );
}
