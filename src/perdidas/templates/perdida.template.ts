import { Perdida } from "src/core/models/perdida.model";
import { generateMapboxStaticImage } from "../utils/utils";
import { PerdidaType } from "src/core/enums/perdida-type.enum";

const perdidaTypeLabels: Record<PerdidaType, { label: string; emoji: string }> = {
    [PerdidaType.THIEFS]: { label: "Robo menor", emoji: "🕵️" },
    [PerdidaType.ROBBERY]: { label: "Asalto", emoji: "🔫" },
    [PerdidaType.VANDALISM]: { label: "Vandalismo", emoji: "💥" },
    [PerdidaType.FRAUD]: { label: "Fraude", emoji: "🃏" },
    [PerdidaType.KIDNAPPING]: { label: "Secuestro", emoji: "🚨" },
    [PerdidaType.TRAFFIC]: { label: "Tráfico", emoji: "🚗" },
    [PerdidaType.ACCIDENTS]: { label: "Accidente", emoji: "💥" },
    [PerdidaType.POTHOLE]: { label: "Bache", emoji: "🕳️" },
    [PerdidaType.BROKEN_TRAFFIC_LIGHT]: { label: "Semáforo descompuesto", emoji: "🚦" },
    [PerdidaType.FIRE]: { label: "Incendio", emoji: "🔥" },
    [PerdidaType.EXPLOSION]: { label: "Explosión", emoji: "💣" },
    [PerdidaType.GAS_LEAK]: { label: "Fuga de gas", emoji: "⚠️" },
    [PerdidaType.COLLAPSE]: { label: "Derrumbe", emoji: "🏚️" },
    [PerdidaType.FLOOD]: { label: "Inundación", emoji: "🌊" },
    [PerdidaType.EARTHQUAKE]: { label: "Sismo", emoji: "🌍" },
    [PerdidaType.LANDSLIDE]: { label: "Deslizamiento", emoji: "⛰️" },
    [PerdidaType.POWER_OUTAGE]: { label: "Apagón", emoji: "🔌" },
    [PerdidaType.WATER_LEAK]: { label: "Fuga de agua", emoji: "💧" },
    [PerdidaType.OPEN_MANHOLE]: { label: "Alcantarilla abierta", emoji: "🚧" },
    [PerdidaType.STREET_LIGHT_OUT]: { label: "Luminaria apagada", emoji: "💡" },
    [PerdidaType.MEDICAL_EMERGENCY]: { label: "Emergencia médica", emoji: "🏥" },
    [PerdidaType.POLLUTION]: { label: "Contaminación", emoji: "🏭" },
    [PerdidaType.OTHER]: { label: "Otro", emoji: "📌" },
};
 
export const generatePerdidaEmailTemplate = (perdida: Perdida): string => {
    const imageUrl = generateMapboxStaticImage(perdida.lat, perdida.lon);
    const typeInfo = perdidaTypeLabels[perdida.type] ?? { label: "Perdida", emoji: "📌" };
 
    return `
    <div style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
 
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:32px 32px 24px;text-align:center;">
                  <p style="margin:0 0 8px;font-size:14px;color:#a0aec0;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Reporte de Incidente</p>
                  <h1 style="margin:0;font-size:26px;color:#ffffff;font-weight:700;line-height:1.3;">${perdida.title}</h1>
                </td>
              </tr>
 
              <!-- Type Badge -->
              <tr>
                <td style="padding:24px 32px 0;text-align:center;">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                    <tr>
                      <td style="background-color:#edf2f7;border-radius:24px;padding:8px 20px;">
                        <span style="font-size:18px;vertical-align:middle;">${typeInfo.emoji}</span>
                        <span style="font-size:14px;font-weight:600;color:#2d3748;vertical-align:middle;margin-left:6px;">${typeInfo.label}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
 
              <!-- Description -->
              <tr>
                <td style="padding:20px 32px 0;">
                  <p style="margin:0;font-size:15px;line-height:1.6;color:#4a5568;text-align:center;">${perdida.description}</p>
                </td>
              </tr>
 
              <!-- Divider -->
              <tr>
                <td style="padding:24px 32px 0;">
                  <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" />
                </td>
              </tr>
 
              <!-- Map Image -->
              <tr>
                <td style="padding:24px 32px 0;">
                  <p style="margin:0 0 12px;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Ubicación</p>
                  <img
                    src="${imageUrl}"
                    width="456"
                    style="width:100%;height:auto;border-radius:12px;display:block;"
                    alt="Mapa de ubicación del incidente"
                  />
                </td>
              </tr>
 
              <!-- Coordinates -->
              <tr>
                <td style="padding:16px 32px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding-right:8px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border-radius:10px;">
                          <tr>
                            <td style="padding:12px 16px;">
                              <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Latitud</p>
                              <p style="margin:0;font-size:16px;color:#2d3748;font-weight:700;font-family:'SF Mono',Monaco,monospace;">${perdida.lat.toFixed(6)}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td width="50%" style="padding-left:8px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border-radius:10px;">
                          <tr>
                            <td style="padding:12px 16px;">
                              <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Longitud</p>
                              <p style="margin:0;font-size:16px;color:#2d3748;font-weight:700;font-family:'SF Mono',Monaco,monospace;">${perdida.lon.toFixed(6)}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
 
              <!-- Footer -->
              <tr>
                <td style="padding:28px 32px 32px;text-align:center;">
                  <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />
                  <p style="margin:0;font-size:12px;color:#a0aec0;">Este correo fue generado automáticamente por el sistema de incidentes 611.</p>
                </td>
              </tr>
 
            </table>
          </td>
        </tr>
      </table>
    </div>
    `;
};