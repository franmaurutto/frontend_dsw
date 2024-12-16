import React from "react";
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, screen,render, waitFor} from "@testing-library/react";
import HomePage from "./HomePage.js";
import { MemoryRouter } from 'react-router-dom';

test('contenido render', () =>{
    const view = render(
    <MemoryRouter>
        <HomePage />
    </MemoryRouter>
    );
    expect(screen.getByText('Empodera tu futuro con EducaTech')).toBeInTheDocument();
    const buttonElement = screen.getByText(/Iniciar Sesion/i);
    expect(buttonElement).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
});

test('probar funcionalidades adicionales', () => {
    const view = render(
        <MemoryRouter>
            <HomePage />
        </MemoryRouter>
    );
    const registerButton = screen.getByText(/Registrate/i);
    expect(registerButton).toBeInTheDocument();
    fireEvent.click(registerButton); 
    const programImage = screen.getByAltText(/Descripción de la imagen/i);
    expect(programImage).toBeInTheDocument();
    expect(programImage).toHaveAttribute('src', '/milogo.png');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    expect(passwordInput).toHaveAttribute('type', 'Password');
    const togglePasswordButton = screen.getByTestId('toggle-password');
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'Password');
});

test('muestra un mensaje de error cuando ocurre un error de autenticación', async () => {
    const mockAuthUsuario = jest.spyOn(require('../services/UsuarioServices'), 'authUsuario').mockRejectedValueOnce(new Error('Correo o contraseña incorrecta'));
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const submitButton = screen.getByText(/Iniciar Sesion/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    const errorMessage = await screen.findByText('Correo o contraseña incorrecta');
    expect(errorMessage).toBeInTheDocument();
    mockAuthUsuario.mockRestore();
  });

test('cambia la visibilidad de la contraseña al hacer clic en el botón de alternar visibilidad', () => {
render(
    <MemoryRouter>
    <HomePage />
    </MemoryRouter>
);

const passwordInput = screen.getByPlaceholderText('Contraseña');
const togglePasswordButton = screen.getByTestId('toggle-password');
expect(passwordInput).toHaveAttribute('type', 'Password');
fireEvent.click(togglePasswordButton);
expect(passwordInput).toHaveAttribute('type', 'text');
fireEvent.click(togglePasswordButton);
expect(passwordInput).toHaveAttribute('type', 'Password');
});
  
