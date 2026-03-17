import { Perdida } from "src/core/models/perdida.model";

export const generatePerdidaEmailTemplate = (perdida:Perdida) : string =>{
    return `
        <style>
            
        </style>
        <h1>${perdida.title}</h1>
        <h2>${perdida.description}</h2>
        <p> ${perdida.lat}</p>
        <p>${perdida.lon}</p>
    
    `;
};