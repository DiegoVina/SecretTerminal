class Terminal {
    private output: HTMLElement;
    private input: HTMLInputElement;
    private history: string[] = [];
    private historyIndex: number = -1;
    private maxLines: number = 10;
    private introMessage: string = "Terminal secreta sobre DIEGO VIÑA. Escriba 'ayuda' para obtener la lista de comandos.";
    private introElement: HTMLDivElement | null = null;

    constructor() {
        this.output = document.getElementById("output")!;
        this.input = document.getElementById("command-input")! as HTMLInputElement;

        if (!this.output || !this.input) {
            console.error("ERROR: No se encontraron elementos necesarios en el DOM");
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
        const commandElement = this.addToOutput(`$ ${command}`);

        if (command === "clear") {
            this.clearOutput();
            return;
        }

        const section = document.getElementById(command) as HTMLElement | null;

        if (section) {
            this.showSection(section, commandElement);
        } else {
            this.addToOutput("Comando no encontrado. Escriba 'ayuda' para obtener la lista completa de comandos.");
        }

        this.paginate();
        this.scrollToBottom();
    }

    private showSection(section: HTMLElement, commandElement: HTMLElement) {
        section.classList.add("active");
        commandElement.insertAdjacentElement("afterend", section);
        this.paginate();
    }

    private addToOutput(text: string): HTMLElement {
        const line = document.createElement("p");
        line.textContent = text;
        this.output.appendChild(line);
        return line;
    }

    private clearOutput() {
        this.output.innerHTML = "";
        this.render();
    }

    private paginate() {
        const lines = Array.from(this.output.children);
        while (lines.length > this.maxLines) {
            if (lines[0] === this.introElement) {
                lines.shift();
            }
            this.output.removeChild(lines[0]);
            lines.shift();
        }
    }

    private scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    private render() {
        if (!this.introElement) {
            this.introElement = document.createElement("div");

            // Si es la primera vez, aplicar la animación
            if (!sessionStorage.getItem("hasShownIntro")) {
                this.introElement.classList.add("typewriter");
                sessionStorage.setItem("hasShownIntro", "true");
            }

            const introMessage = document.createElement("p");
            introMessage.textContent = this.introMessage;
            this.introElement.appendChild(introMessage);
        }

        this.output.appendChild(this.introElement);
    }
}

document.addEventListener("DOMContentLoaded", () => new Terminal());
