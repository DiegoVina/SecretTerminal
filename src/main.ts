class Terminal {
    private output: HTMLElement;
    private input: HTMLInputElement;
    private history: string[] = [];
    private historyIndex: number = -1;
    private maxLines: number = 10;

    constructor() {
        this.output = document.getElementById("output")!;
        this.input = document.getElementById("command-input")! as HTMLInputElement;

        if (!this.output || !this.input) {
            console.error("❌ ERROR: No se encontraron elementos necesarios en el DOM");
            return;
        }

        this.input.addEventListener("keydown", (e) => this.handleInput(e));
        this.render();
    }

    private handleInput(e: KeyboardEvent) {
        if (e.key === "Enter") {
            const command = this.input.value.trim();
            if (command) {
                this.history.push(command);
                this.historyIndex = this.history.length;
                this.processCommand(command);
            }
            this.input.value = "";
        } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            this.navigateHistory(e.key);
        }
    }

    private navigateHistory(key: string) {
        if (key === "ArrowUp" && this.historyIndex > 0) {
            this.historyIndex--;
        } else if (key === "ArrowDown" && this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
        } else {
            this.historyIndex = this.history.length;
            this.input.value = "";
            return;
        }
        this.input.value = this.history[this.historyIndex] || "";
    }

    private processCommand(command: string) {
        this.addToOutput(`$ ${command}`);
    
        // Verificamos qué elementos están dentro del output antes de buscar
        console.log("Contenido de output:", this.output.innerHTML);
    
        const section = this.output.querySelector(`#${command}`) as HTMLElement | null;
    
        if (section) {
            console.log(`Se encontró la sección: #${command}`);
            this.showSection(section);
        } else {
            console.log(`❌ No se encontró la sección: #${command}`);
            this.addToOutput("Comando no encontrado. Escriba 'ayuda' para obtener la lista completa de comandos.");
        }
        this.paginate();
    }

    private showSection(section: HTMLElement) {
        document.querySelectorAll(".section-content").forEach(el => el.classList.remove("active")); // Desactiva las secciones activas
        section.classList.add("active"); // Activa la nueva sección
    }

    private addToOutput(text: string) {
        const line = document.createElement("p");
        line.textContent = text;
        this.output.appendChild(line);
    }

    private paginate() {
        const lines = this.output.querySelectorAll("p");
        if (lines.length > this.maxLines) {
            this.output.removeChild(lines[0]);
        }
    }

    private render() {
        const introMessage = document.createElement("p");
        introMessage.textContent = "Terminal secreta sobre el agente JOHN DOE. Escriba 'ayuda' para obtener la lista completa de comandos.";
        this.output.prepend(introMessage); // Agrega el mensaje al inicio sin borrar nada
    }
    
}

document.addEventListener("DOMContentLoaded", () => new Terminal());
