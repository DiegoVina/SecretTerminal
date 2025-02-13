class Terminal {
    private output: HTMLElement;
    private input: HTMLInputElement;
    private history: string[] = [];
    private historyIndex: number = -1;
    private maxLines: number = 10;
    
    constructor() {
        this.output = document.getElementById("output")!;
        this.input = document.getElementById("command-input")! as HTMLInputElement;
        
        this.input.addEventListener("keydown", (e) => this.handleInput(e));
        this.render();
    }
    
    private handleInput(e: KeyboardEvent) {
        const commands = ["ArrowUp", "ArrowDown", "Enter"];
        if (!commands.includes(e.key)) return;
        
        if (e.key === "Enter") {
            const command = this.input.value.trim();
            if (command) {
                this.history.push(command);
                this.historyIndex = this.history.length;
                this.processCommand(command);
            }
            this.input.value = "";
        } else {
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
        const section = document.getElementById(command);
        
        if (section) {
            this.showSection(section);
        } else {
            this.addToOutput("Command not found. Type 'help' for a list of commands.");
        }
        this.paginate();
    }
    
    private showSection(section: HTMLElement) {
        Array.from(document.querySelectorAll(".section-content")).forEach(el => el.classList.add("hidden"));
        section.classList.remove("hidden");
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
        this.output.innerHTML = "<p>Welcome to my portfolio terminal! Type 'help' to see available commands.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => new Terminal());
