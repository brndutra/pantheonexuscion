import React, { useEffect, useMemo, useState } from "react";

type DamageType = 0 | 1 | 2 | 3; // 0 none, 1 bashing, 2 lethal, 3 aggravated

type AttributeName =
  | "Strength"
  | "Dexterity"
  | "Stamina"
  | "Charisma"
  | "Manipulation"
  | "Appearance"
  | "Perception"
  | "Intelligence"
  | "Wits";

type AttributeCategory = "Physical" | "Social" | "Mental";

interface Attribute {
  name: AttributeName;
  value: number;
  epic: number;
}

interface Ability {
  name: string;
  value: number;
}

interface Calling {
  name: string;
  value: number;
}

interface Virtue {
  name: string;
  value: number;
}

interface CharacterSheet {
  id: string;
  name: string;
  title: string;
  concept: string;
  pantheon: string;
  patron: string;
  legend: number;
  willpowerCurrent: number;
  willpowerTotal: number;
  health: DamageType[];
  attributes: Record<AttributeCategory, Attribute[]>;
  abilities: Ability[];
  virtues: Virtue[];
  callings: Calling[];
  biography: string;
}

const STORAGE_KEY = "pantheonexus_minimal_sheet_v1";

const DEFAULT_ATTRIBUTES: Record<AttributeCategory, Attribute[]> = {
  Physical: [
    { name: "Strength", value: 1, epic: 0 },
    { name: "Dexterity", value: 1, epic: 0 },
    { name: "Stamina", value: 1, epic: 0 },
  ],
  Social: [
    { name: "Charisma", value: 1, epic: 0 },
    { name: "Manipulation", value: 1, epic: 0 },
    { name: "Appearance", value: 1, epic: 0 },
  ],
  Mental: [
    { name: "Perception", value: 1, epic: 0 },
    { name: "Intelligence", value: 1, epic: 0 },
    { name: "Wits", value: 1, epic: 0 },
  ],
};

const DEFAULT_ABILITIES = [
  "Academics",
  "Animal Ken",
  "Art",
  "Athletics",
  "Awareness",
  "Brawl",
  "Command",
  "Control",
  "Craft",
  "Empathy",
  "Fortitude",
  "Integrity",
  "Investigation",
  "Larceny",
  "Marksmanship",
  "Medicine",
  "Melee",
  "Occult",
  "Politics",
  "Presence",
  "Science",
  "Stealth",
  "Survival",
  "Thrown",
].map((name) => ({ name, value: 0 }));

const DEFAULT_SHEET: CharacterSheet = {
  id: crypto.randomUUID(),
  name: "Novo Scion",
  title: "Herói em Ascensão",
  concept: "",
  pantheon: "",
  patron: "",
  legend: 1,
  willpowerCurrent: 5,
  willpowerTotal: 5,
  health: [0, 0, 0, 0, 0, 0, 0],
  attributes: DEFAULT_ATTRIBUTES,
  abilities: DEFAULT_ABILITIES,
  virtues: [
    { name: "Courage", value: 1 },
    { name: "Justice", value: 1 },
    { name: "Loyalty", value: 1 },
    { name: "Temperance", value: 1 },
  ],
  callings: [
    { name: "Warrior", value: 1 },
    { name: "Leader", value: 0 },
    { name: "Sage", value: 0 },
  ],
  biography: "",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function loadSheet(): CharacterSheet {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_SHEET;

  try {
    const parsed = JSON.parse(raw) as CharacterSheet;
    return parsed;
  } catch {
    return DEFAULT_SHEET;
  }
}

function saveSheet(sheet: CharacterSheet) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sheet));
}

function Stepper({
  value,
  onChange,
  min = 0,
  max = 10,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(clamp(value - 1, min, max))}>
        -
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(clamp(value + 1, min, max))}>
        +
      </button>
    </div>
  );
}

function HealthBox({
  state,
  onClick,
}: {
  state: DamageType;
  onClick: () => void;
}) {
  const label = state === 0 ? "" : state === 1 ? "/" : state === 2 ? "X" : "*";

  return (
    <button
      type="button"
      className="health-box"
      data-state={state}
      onClick={onClick}
      title="0 vazio, 1 contusão, 2 letal, 3 agravado"
    >
      {label}
    </button>
  );
}

export function CharacterSheetApp() {
  const [sheet, setSheet] = useState<CharacterSheet>(DEFAULT_SHEET);
  const [savedAt, setSavedAt] = useState<string>("");

  useEffect(() => {
    setSheet(loadSheet());
  }, []);

  useEffect(() => {
    saveSheet(sheet);
    setSavedAt(new Date().toLocaleString("pt-BR"));
  }, [sheet]);

  const healthSummary = useMemo(() => {
    const bashing = sheet.health.filter((x) => x === 1).length;
    const lethal = sheet.health.filter((x) => x === 2).length;
    const aggravated = sheet.health.filter((x) => x === 3).length;
    return { bashing, lethal, aggravated };
  }, [sheet.health]);

  function updateField<K extends keyof CharacterSheet>(key: K, value: CharacterSheet[K]) {
    setSheet((prev) => ({ ...prev, [key]: value }));
  }

  function updateAttribute(
    category: AttributeCategory,
    index: number,
    patch: Partial<Attribute>
  ) {
    setSheet((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [category]: prev.attributes[category].map((attr, i) =>
          i === index ? { ...attr, ...patch } : attr
        ),
      },
    }));
  }

  function updateAbility(index: number, value: number) {
    setSheet((prev) => ({
      ...prev,
      abilities: prev.abilities.map((a, i) => (i === index ? { ...a, value } : a)),
    }));
  }

  function updateVirtue(index: number, value: number) {
    setSheet((prev) => ({
      ...prev,
      virtues: prev.virtues.map((v, i) => (i === index ? { ...v, value } : v)),
    }));
  }

  function updateCalling(index: number, value: number) {
    setSheet((prev) => ({
      ...prev,
      callings: prev.callings.map((c, i) => (i === index ? { ...c, value } : c)),
    }));
  }

  function cycleHealth(index: number) {
    setSheet((prev) => ({
      ...prev,
      health: prev.health.map((box, i) =>
        i === index ? (((box + 1) % 4) as DamageType) : box
      ),
    }));
  }

  function resetSheet() {
    const confirmed = window.confirm("Resetar a ficha para o padrão?");
    if (!confirmed) return;
    setSheet({
      ...DEFAULT_SHEET,
      id: crypto.randomUUID(),
    });
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(sheet, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sheet.name || "ficha"}-sheet.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as CharacterSheet;
        setSheet(parsed);
      } catch {
        alert("Arquivo inválido.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="app">
      <h1 className="title">Ficha Scion — versão mínima funcional</h1>
      <p className="subtitle">
        Edição local, salvamento automático no navegador e export/import JSON.
      </p>

      <div className="grid grid-2">
        <section className="card">
          <h2>Identidade</h2>

          <div className="field">
            <label>Nome</label>
            <input
              value={sheet.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Título</label>
            <input
              value={sheet.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Conceito</label>
            <input
              value={sheet.concept}
              onChange={(e) => updateField("concept", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Panteão</label>
            <input
              value={sheet.pantheon}
              onChange={(e) => updateField("pantheon", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Patrono divino</label>
            <input
              value={sheet.patron}
              onChange={(e) => updateField("patron", e.target.value)}
            />
          </div>
        </section>

        <section className="card">
          <h2>Recursos</h2>

          <div className="row">
            <div>
              <div className="name">Legend</div>
              <div className="muted">Nível de lenda</div>
            </div>
            <Stepper
              value={sheet.legend}
              min={1}
              max={12}
              onChange={(value) => updateField("legend", value)}
            />
          </div>

          <div className="row">
            <div>
              <div className="name">Willpower atual</div>
              <div className="muted">Pontos disponíveis</div>
            </div>
            <Stepper
              value={sheet.willpowerCurrent}
              min={0}
              max={10}
              onChange={(value) => updateField("willpowerCurrent", value)}
            />
          </div>

          <div className="row">
            <div>
              <div className="name">Willpower total</div>
              <div className="muted">Capacidade máxima</div>
            </div>
            <Stepper
              value={sheet.willpowerTotal}
              min={1}
              max={10}
              onChange={(value) => updateField("willpowerTotal", value)}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="name" style={{ marginBottom: 8 }}>Health Track</div>
            <div className="health-track">
              {sheet.health.map((box, i) => (
                <HealthBox key={i} state={box} onClick={() => cycleHealth(i)} />
              ))}
            </div>
            <p className="small" style={{ marginTop: 10 }}>
              Contusão: {healthSummary.bashing} · Letal: {healthSummary.lethal} ·
              Agravado: {healthSummary.aggravated}
            </p>
          </div>
        </section>
      </div>

      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {(["Physical", "Social", "Mental"] as AttributeCategory[]).map((category) => (
          <section className="card" key={category}>
            <h2>{category} Attributes</h2>
            {sheet.attributes[category].map((attr, index) => (
              <div className="row" key={attr.name}>
                <div>
                  <div className="name">{attr.name}</div>
                  <div className="muted">Epic: {attr.epic}</div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <div>
                    <div className="small">Base</div>
                    <Stepper
                      value={attr.value}
                      min={1}
                      max={10}
                      onChange={(value) =>
                        updateAttribute(category, index, { value })
                      }
                    />
                  </div>

                  <div>
                    <div className="small">Epic</div>
                    <Stepper
                      value={attr.epic}
                      min={0}
                      max={10}
                      onChange={(epic) =>
                        updateAttribute(category, index, { epic })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>

      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <section className="card">
          <h2>Virtues</h2>
          {sheet.virtues.map((virtue, index) => (
            <div className="row" key={virtue.name}>
              <div className="name">{virtue.name}</div>
              <Stepper
                value={virtue.value}
                min={0}
                max={5}
                onChange={(value) => updateVirtue(index, value)}
              />
            </div>
          ))}
        </section>

        <section className="card">
          <h2>Callings</h2>
          {sheet.callings.map((calling, index) => (
            <div className="row" key={calling.name}>
              <div className="name">{calling.name}</div>
              <Stepper
                value={calling.value}
                min={0}
                max={5}
                onChange={(value) => updateCalling(index, value)}
              />
            </div>
          ))}
        </section>

        <section className="card">
          <h2>Biography</h2>
          <div className="field">
            <label>Notas</label>
            <textarea
              rows={12}
              value={sheet.biography}
              onChange={(e) => updateField("biography", e.target.value)}
            />
          </div>
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Abilities</h2>
        <div className="grid grid-3">
          {sheet.abilities.map((ability, index) => (
            <div className="row" key={ability.name}>
              <div className="name">{ability.name}</div>
              <Stepper
                value={ability.value}
                min={0}
                max={5}
                onChange={(value) => updateAbility(index, value)}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="actions">
        <button className="primary" type="button" onClick={exportJson}>
          Exportar JSON
        </button>

        <label>
          <input
            type="file"
            accept="application/json"
            onChange={importJson}
            style={{ display: "none" }}
          />
          <span
            style={{
              display: "inline-block",
              background: "#1b2230",
              border: "1px solid #2a3447",
              padding: "8px 12px",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Importar JSON
          </span>
        </label>

        <button className="danger" type="button" onClick={resetSheet}>
          Resetar ficha
        </button>

        <span className="small" style={{ alignSelf: "center" }}>
          Último autosave: {savedAt || "—"}
        </span>
      </div>
    </div>
  );
}
