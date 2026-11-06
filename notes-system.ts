
export {}; 
 
// =====================  Base Class: User =====================
class User {
  protected id: number;
  public name: string;
  public email: string;
  private password: string;
  public phone: string;
  private _age!: number;
 
 
  private notebooks: NoteBook[] = [];
 
  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.age = age;
  }
 
  get age(): number {
    return this._age;
  }
 
  set age(value: number) {
    if (value < 18 || value > 60) {
      throw new Error("Age must be between 18 and 60");
    }
    this._age = value;
  }
 
  getId(): number {
    return this.id;
  }
 
  checkPassword(input: string): boolean {
    return this.password === input;
  }
 
  displayInfo(): void {
    console.log(
      `User #${this.id} | Name: ${this.name} | Email: ${this.email} | Phone: ${this.phone} | Age: ${this._age}`
    );
  }
 
  // =====================  Aggregation: User NoteBook =====================

  addNotebook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }
 
  removeNotebook(notebookId: number): void {
    this.notebooks = this.notebooks.filter((nb) => nb.id !== notebookId);
  }
 
  getNotebooks(): NoteBook[] {
    return this.notebooks;
  }
}
 
// ===================== Inheritance: Admin extends User =====================

class Admin extends User {
  manageNotes(notebook: NoteBook, action: "delete", noteId: number): void {
    if (action === "delete") {
      notebook.removeNote(noteId);
      console.log(`Admin ${this.name} deleted note #${noteId}`);
    }
  }
 
  override displayInfo(): void {
    console.log("[ADMIN]");
    super.displayInfo();
  }
}
 
// =====================  Class: Note =====================
// ===================== Association: Note User (author) =====================
class Note {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public author: User // every note has an author
  ) {}
 
  get userId(): number {
    return this.author.getId();
  }
 
  preview(length: number = 30): string {
    return this.content.length > length
      ? this.content.substring(0, length) + "..."
      : this.content;
  }
}
 
// =====================  Composition: NoteBook Note =====================
// Notes are created INSIDE the notebook and can't exist without it.
class NoteBook {
  private notes: Note[] = [];
  private nextNoteId = 1;
 
  constructor(public id: number, public name: string) {}
 
  addNote(title: string, content: string, author: User): Note {
    const note = new Note(this.nextNoteId++, title, content, author);
    this.notes.push(note);
    return note;
  }
 
  removeNote(noteId: number): void {
    this.notes = this.notes.filter((n) => n.id !== noteId);
  }
 
  getNotes(): Note[] {
    return this.notes;
  }
}
 
// ===================== Generics: Storage<T> =====================
class Storage<T> {
  private items: T[] = [];
 
  addItem(item: T): void {
    this.items.push(item);
  }
 
  removeItem(item: T): void {
    this.items = this.items.filter((i) => i !== item);
  }
 
  getAllItems(): T[] {
    return this.items;
  }
}
 
// ===================== Demo =====================

const user = new User(1, 
    "Ahmed", "ahmed@mail.com","1234", "01234556789", 25);
const admin = new Admin(2, "Sara", "sara@mail.com", "admin", "01098765432", 30);
 
user.displayInfo();
admin.displayInfo();
 
const notebook = new NoteBook(1, "Work");
user.addNotebook(notebook); 
 
const note = notebook.addNote("Todo", "Finish the TypeScript OOP assignment today", user);
console.log(note.preview(20), "| author id:", note.userId);
 
admin.manageNotes(notebook, "delete", note.id);
 
const numbers = new Storage<number>();
numbers.addItem(10);
numbers.addItem(20);
numbers.removeItem(10);
console.log(numbers.getAllItems()); // [20]
 
const noteStorage = new Storage<Note>();
noteStorage.addItem(note);
console.log(noteStorage.getAllItems().length);
 