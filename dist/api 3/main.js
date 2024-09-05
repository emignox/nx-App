/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("reflect-metadata");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const nestjs_1 = __webpack_require__(6);
const notebook_service_1 = __webpack_require__(7);
const notebook_controller_1 = __webpack_require__(11);
const notebook_entity_1 = __webpack_require__(8);
const mongodb_1 = __webpack_require__(10);
const graphql_1 = __webpack_require__(13);
const apollo_1 = __webpack_require__(15);
const notebook_resolver_1 = __webpack_require__(16);
let NotebookModule = class NotebookModule {
};
exports.NotebookModule = NotebookModule;
exports.NotebookModule = NotebookModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_1.MikroOrmModule.forRoot((0, mongodb_1.defineConfig)({
                clientUrl: 'mongodb://localhost:27017/notebook-management', // URL del database MongoDB
                entities: [notebook_entity_1.Task], // Le entità che MikroORM gestirà
                dbName: 'notebook-management', // Nome del database
                allowGlobalContext: true
            })),
            nestjs_1.MikroOrmModule.forFeature([notebook_entity_1.Task]), // Configurazione dell'entità Task per MikroORM
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver, // Configura il driver Apollo
                autoSchemaFile: true, // Genera automaticamente il file di schema
                playground: true, // Abilita GraphQL Playground per testare le query
            })
        ],
        providers: [notebook_service_1.NotebookService, notebook_resolver_1.NotebookResolver],
        controllers: [notebook_controller_1.NotebookController],
    })
], NotebookModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@mikro-orm/nestjs");

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const notebook_entity_1 = __webpack_require__(8);
const mongodb_1 = __webpack_require__(10);
const core_1 = __webpack_require__(9);
let NotebookService = class NotebookService {
    constructor(orm) {
        this.orm = orm;
        this.em = this.orm.em;
    }
    async createNotebook(createNotebookInput) {
        const { title, content } = createNotebookInput;
        const notebook = new notebook_entity_1.Task();
        notebook.title = title;
        notebook.content = content;
        await this.em.persistAndFlush(notebook);
        return notebook;
    }
    async getNotebookById(_id) {
        const notebook = await this.em.findOne(notebook_entity_1.Task, { _id: new mongodb_1.ObjectId(_id) });
        if (!notebook) {
            throw new common_1.NotFoundException(`Notebook with ID ${_id} not found`);
        }
        return notebook;
    }
    async getNotebooks() {
        return this.em.find(notebook_entity_1.Task, {});
    }
    async updateNotebook(updateNotebookInput) {
        const { id, title, content } = updateNotebookInput;
        const notebook = await this.em.findOne(notebook_entity_1.Task, { _id: new mongodb_1.ObjectId(id) });
        if (!notebook) {
            throw new common_1.NotFoundException(`Notebook with ID ${id} not found`);
        }
        if (title)
            notebook.title = title;
        if (content !== undefined)
            notebook.content = content; // Aggiorna solo se content è definito
        await this.em.flush();
        return notebook;
    }
    async deleteNotebook(_id) {
        const notebook = await this.em.findOne(notebook_entity_1.Task, { _id: new mongodb_1.ObjectId(_id) });
        if (!notebook) {
            throw new common_1.NotFoundException(`Notebook with ID ${_id} not found`);
        }
        await this.em.removeAndFlush(notebook);
    }
};
exports.NotebookService = NotebookService;
exports.NotebookService = NotebookService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof core_1.MikroORM !== "undefined" && core_1.MikroORM) === "function" ? _a : Object])
], NotebookService);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Task = void 0;
const tslib_1 = __webpack_require__(5);
const core_1 = __webpack_require__(9);
const mongodb_1 = __webpack_require__(10);
let Task = class Task {
    constructor() {
        this.completed = false;
    }
};
exports.Task = Task;
tslib_1.__decorate([
    (0, core_1.PrimaryKey)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], Task.prototype, "_id", void 0);
tslib_1.__decorate([
    (0, core_1.Property)(),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "title", void 0);
tslib_1.__decorate([
    (0, core_1.Property)({ default: '' }) // Imposta un valore di default per content
    ,
    tslib_1.__metadata("design:type", String)
], Task.prototype, "content", void 0);
tslib_1.__decorate([
    (0, core_1.Property)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Task.prototype, "completed", void 0);
tslib_1.__decorate([
    (0, core_1.Property)({ onCreate: () => new Date() }),
    tslib_1.__metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Task.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, core_1.Property)({ onCreate: () => new Date(), onUpdate: () => new Date() }),
    tslib_1.__metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Task.prototype, "updatedAt", void 0);
exports.Task = Task = tslib_1.__decorate([
    (0, core_1.Entity)()
], Task);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@mikro-orm/core");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@mikro-orm/mongodb");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const notebook_service_1 = __webpack_require__(7);
const create_notebook_input_1 = __webpack_require__(12); // Assicurati che i DTO siano corretti
const update_notebook_input_1 = __webpack_require__(14);
let NotebookController = class NotebookController {
    constructor(notebookService) {
        this.notebookService = notebookService;
    }
    async getAllNotebooks() {
        return this.notebookService.getNotebooks();
    }
    async getNotebook(id) {
        return this.notebookService.getNotebookById(id);
    }
    async createNotebook(createNotebookInput) {
        return this.notebookService.createNotebook(createNotebookInput);
    }
    async updateNotebook(id, updateNotebookInput) {
        return this.notebookService.updateNotebook({ id, ...updateNotebookInput });
    }
    async deleteNotebook(id) {
        return this.notebookService.deleteNotebook(id);
    }
};
exports.NotebookController = NotebookController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], NotebookController.prototype, "getAllNotebooks", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], NotebookController.prototype, "getNotebook", null);
tslib_1.__decorate([
    (0, common_1.Post)('/create'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof create_notebook_input_1.CreateNotebookInput !== "undefined" && create_notebook_input_1.CreateNotebookInput) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], NotebookController.prototype, "createNotebook", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_f = typeof update_notebook_input_1.UpdateNotebookInput !== "undefined" && update_notebook_input_1.UpdateNotebookInput) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], NotebookController.prototype, "updateNotebook", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], NotebookController.prototype, "deleteNotebook", null);
exports.NotebookController = NotebookController = tslib_1.__decorate([
    (0, common_1.Controller)('notebooks'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof notebook_service_1.NotebookService !== "undefined" && notebook_service_1.NotebookService) === "function" ? _a : Object])
], NotebookController);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateNotebookInput = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(13);
let CreateNotebookInput = class CreateNotebookInput {
};
exports.CreateNotebookInput = CreateNotebookInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], CreateNotebookInput.prototype, "title", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], CreateNotebookInput.prototype, "content", void 0);
exports.CreateNotebookInput = CreateNotebookInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CreateNotebookInput);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@nestjs/graphql");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateNotebookInput = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(13);
let UpdateNotebookInput = class UpdateNotebookInput {
};
exports.UpdateNotebookInput = UpdateNotebookInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], UpdateNotebookInput.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateNotebookInput.prototype, "title", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateNotebookInput.prototype, "content", void 0);
exports.UpdateNotebookInput = UpdateNotebookInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], UpdateNotebookInput);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("@nestjs/apollo");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookResolver = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(13);
const notebook_service_1 = __webpack_require__(7);
const notebook_type_1 = __webpack_require__(17);
const create_notebook_input_1 = __webpack_require__(12);
const update_notebook_input_1 = __webpack_require__(14);
let NotebookResolver = class NotebookResolver {
    constructor(notebookService) {
        this.notebookService = notebookService;
    }
    async notebooks() {
        const notebooks = await this.notebookService.getNotebooks();
        notebooks.forEach(notebook => {
            if (!notebook.content) {
                console.warn(`Notebook with ID ${notebook._id} has null content.`);
            }
        });
        return notebooks;
    }
    async createNotebook(createNotebookInput) {
        return this.notebookService.createNotebook(createNotebookInput);
    }
    async updateNotebook(updateNotebookInput) {
        return this.notebookService.updateNotebook(updateNotebookInput);
    }
    async deleteNotebook(id) {
        await this.notebookService.deleteNotebook(id);
        return true;
    }
};
exports.NotebookResolver = NotebookResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [notebook_type_1.NotebookType]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], NotebookResolver.prototype, "notebooks", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => notebook_type_1.NotebookType),
    tslib_1.__param(0, (0, graphql_1.Args)('createNotebookInput')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_notebook_input_1.CreateNotebookInput !== "undefined" && create_notebook_input_1.CreateNotebookInput) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NotebookResolver.prototype, "createNotebook", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => notebook_type_1.NotebookType),
    tslib_1.__param(0, (0, graphql_1.Args)('updateNotebookInput')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof update_notebook_input_1.UpdateNotebookInput !== "undefined" && update_notebook_input_1.UpdateNotebookInput) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NotebookResolver.prototype, "updateNotebook", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    tslib_1.__param(0, (0, graphql_1.Args)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], NotebookResolver.prototype, "deleteNotebook", null);
exports.NotebookResolver = NotebookResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(() => notebook_type_1.NotebookType),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof notebook_service_1.NotebookService !== "undefined" && notebook_service_1.NotebookService) === "function" ? _a : Object])
], NotebookResolver);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookType = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(13);
let NotebookType = class NotebookType {
};
exports.NotebookType = NotebookType;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", String)
], NotebookType.prototype, "_id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], NotebookType.prototype, "title", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)({ nullable: true }) // Rendi content opzionale
    ,
    tslib_1.__metadata("design:type", String)
], NotebookType.prototype, "content", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], NotebookType.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], NotebookType.prototype, "updatedAt", void 0);
exports.NotebookType = NotebookType = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], NotebookType);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
__webpack_require__(3);
const notebook_module_1 = __webpack_require__(4);
async function bootstrap() {
    const app = await core_1.NestFactory.create(notebook_module_1.NotebookModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3000;
    const corsOptions = {
        origin: ['http://localhost:4200', 'http://localhost:4300'],
    };
    app.enableCors(corsOptions);
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

/******/ })()
;