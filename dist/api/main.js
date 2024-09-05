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
const notebook_controller_1 = __webpack_require__(12);
const notebook_entity_1 = __webpack_require__(8);
const mongodb_1 = __webpack_require__(10);
const graphql_1 = __webpack_require__(14);
const apollo_1 = __webpack_require__(16);
const notebook_resolver_1 = __webpack_require__(17);
const jwt_1 = __webpack_require__(21);
const user_module_1 = __webpack_require__(22);
const user_entity_1 = __webpack_require__(11);
const dotenv = tslib_1.__importStar(__webpack_require__(32));
const graphql_subscriptions_1 = __webpack_require__(20);
dotenv.config();
let NotebookModule = class NotebookModule {
};
exports.NotebookModule = NotebookModule;
exports.NotebookModule = NotebookModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_1.MikroOrmModule.forRoot((0, mongodb_1.defineConfig)({
                clientUrl: process.env.MONGO_CONNECTION || 'mongodb://localhost:27017',
                entities: [notebook_entity_1.Task, user_entity_1.User],
                dbName: 'notebook-management',
            })),
            nestjs_1.MikroOrmModule.forFeature([notebook_entity_1.Task]),
            user_module_1.UserModule,
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: true,
                playground: true,
                subscriptions: {
                    'graphql-ws': true, // Ensure the correct protocol is used
                },
                context: ({ req, connection }) => {
                    let user = null;
                    const jwtService = new jwt_1.JwtService({ secret: process.env.JWT_SECRET || 'default_secret' });
                    if (connection) {
                        // For WebSocket connections
                        const token = connection.context.authToken;
                        if (token) {
                            try {
                                user = jwtService.verify(token.replace('Bearer ', ''));
                            }
                            catch (err) {
                                console.warn('JWT verification failed:', err.message);
                            }
                        }
                    }
                    else if (req) {
                        // For HTTP requests
                        const token = req.headers.authorization || '';
                        if (token) {
                            try {
                                user = jwtService.verify(token.replace('Bearer ', ''));
                            }
                            catch (err) {
                                console.warn('JWT verification failed:', err.message);
                            }
                        }
                    }
                    return { user };
                },
            }),
        ],
        providers: [notebook_service_1.NotebookService, notebook_resolver_1.NotebookResolver, {
                provide: 'PUB_SUB',
                useValue: new graphql_subscriptions_1.PubSub(),
            }],
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
const user_entity_1 = __webpack_require__(11);
let NotebookService = class NotebookService {
    constructor(orm) {
        this.orm = orm;
    }
    get em() {
        return this.orm.em.fork(); // Usa il metodo fork() per creare un nuovo EntityManager per il contesto specifico
    }
    // Funzione per ottenere tutte le note di un utente specifico
    async getUserTasks(userId) {
        const tasks = await this.em.find(notebook_entity_1.Task, { user: new mongodb_1.ObjectId(userId) });
        if (!tasks || tasks.length === 0) {
            throw new common_1.NotFoundException(`No tasks found for user,  create your new first Note 😄`);
        }
        return tasks;
    }
    // Creazione di una nuova nota associata all'utente
    async createNotebook(createNotebookInput, userId) {
        const em = this.em;
        const { title, content } = createNotebookInput;
        const user = await em.findOne(user_entity_1.User, { _id: new mongodb_1.ObjectId(userId) });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const notebook = new notebook_entity_1.Task();
        notebook.title = title;
        notebook.content = content;
        notebook.user = user;
        await em.persistAndFlush(notebook);
        return notebook;
    }
    // Recupera una singola nota per ID
    async getNotebookById(id) {
        const em = this.em;
        const notebook = await em.findOne(notebook_entity_1.Task, { _id: new mongodb_1.ObjectId(id) });
        if (!notebook) {
            throw new common_1.NotFoundException(`Notebook with ID ${id} not found`);
        }
        return notebook;
    }
    // Recupera tutte le note
    async getNotebooks() {
        const em = this.em;
        return em.find(notebook_entity_1.Task, {});
    }
    // Aggiorna una nota esistente
    async updateNotebook(updateNotebookInput, userId) {
        const em = this.em;
        const { id, title, content } = updateNotebookInput;
        const notebook = await em.findOne(notebook_entity_1.Task, { _id: new mongodb_1.ObjectId(id), user: new mongodb_1.ObjectId(userId) });
        if (!notebook) {
            throw new common_1.NotFoundException(`Notebook with ID ${id} not found for user with ID ${userId}`);
        }
        if (title)
            notebook.title = title;
        if (content !== undefined)
            notebook.content = content;
        await em.flush();
        return notebook;
    }
    // Elimina una nota
    async deleteNotebook(id, userId) {
        const em = this.em;
        const notebook = await em.findOne(notebook_entity_1.Task, { _id: new mongodb_1.ObjectId(id), user: new mongodb_1.ObjectId(userId) });
        if (!notebook) {
            throw new common_1.NotFoundException(`Notebook with ID ${id} not found for user with ID ${userId}`);
        }
        await em.removeAndFlush(notebook);
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


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Task = void 0;
const tslib_1 = __webpack_require__(5);
const core_1 = __webpack_require__(9);
const mongodb_1 = __webpack_require__(10);
const user_entity_1 = __webpack_require__(11);
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
tslib_1.__decorate([
    (0, core_1.ManyToOne)(() => user_entity_1.User),
    tslib_1.__metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], Task.prototype, "user", void 0);
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


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const tslib_1 = __webpack_require__(5);
const core_1 = __webpack_require__(9);
const notebook_entity_1 = __webpack_require__(8);
const mongodb_1 = __webpack_require__(10);
let User = class User {
    constructor() {
        this.notebook = new core_1.Collection(this);
    }
};
exports.User = User;
tslib_1.__decorate([
    (0, core_1.PrimaryKey)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], User.prototype, "_id", void 0);
tslib_1.__decorate([
    (0, core_1.Property)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "name", void 0);
tslib_1.__decorate([
    (0, core_1.Property)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    (0, core_1.Property)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "password", void 0);
tslib_1.__decorate([
    (0, core_1.OneToMany)(() => notebook_entity_1.Task, task => task.user),
    tslib_1.__metadata("design:type", Object)
], User.prototype, "notebook", void 0);
exports.User = User = tslib_1.__decorate([
    (0, core_1.Entity)()
], User);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const notebook_service_1 = __webpack_require__(7);
const create_notebook_input_1 = __webpack_require__(13);
const update_notebook_input_1 = __webpack_require__(15);
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
    async getUserNotebooks(userId) {
        return this.notebookService.getUserTasks(userId);
    }
    async createNotebook(createNotebookInput, req) {
        const userId = req.user?.id;
        return this.notebookService.createNotebook(createNotebookInput, userId);
    }
    async updateNotebook(id, updateNotebookInput, req) {
        const userId = req.user?.id;
        return this.notebookService.updateNotebook({ id, ...updateNotebookInput }, userId);
    }
    async deleteNotebook(id, req) {
        const userId = req.user?.id;
        return this.notebookService.deleteNotebook(id, userId);
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
    (0, common_1.Get)('user/notebooks/:userId'),
    tslib_1.__param(0, (0, common_1.Param)('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], NotebookController.prototype, "getUserNotebooks", null);
tslib_1.__decorate([
    (0, common_1.Post)('/create'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_e = typeof create_notebook_input_1.CreateNotebookInput !== "undefined" && create_notebook_input_1.CreateNotebookInput) === "function" ? _e : Object, Object]),
    tslib_1.__metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], NotebookController.prototype, "createNotebook", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_h = typeof update_notebook_input_1.UpdateNotebookInput !== "undefined" && update_notebook_input_1.UpdateNotebookInput) === "function" ? _h : Object, Object]),
    tslib_1.__metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], NotebookController.prototype, "updateNotebook", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], NotebookController.prototype, "deleteNotebook", null);
exports.NotebookController = NotebookController = tslib_1.__decorate([
    (0, common_1.Controller)('notebooks'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof notebook_service_1.NotebookService !== "undefined" && notebook_service_1.NotebookService) === "function" ? _a : Object])
], NotebookController);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateNotebookInput = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(14);
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
/* 14 */
/***/ ((module) => {

module.exports = require("@nestjs/graphql");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateNotebookInput = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(14);
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
/* 16 */
/***/ ((module) => {

module.exports = require("@nestjs/apollo");

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookResolver = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(14);
const notebook_service_1 = __webpack_require__(7);
const notebook_type_1 = __webpack_require__(18);
const create_notebook_input_1 = __webpack_require__(13);
const update_notebook_input_1 = __webpack_require__(15);
const common_1 = __webpack_require__(1);
const graphql_subscriptions_1 = __webpack_require__(20);
let NotebookResolver = class NotebookResolver {
    constructor(notebookService, pubSub) {
        this.notebookService = notebookService;
        this.pubSub = pubSub;
    }
    async getAllNotebooks() {
        return this.notebookService.getNotebooks();
    }
    async getUserNotebooks(context) {
        const userId = context.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('User is not authenticated');
        }
        const tasks = await this.notebookService.getUserTasks(userId);
        return tasks.map(task => ({
            ...task,
            _id: task._id.toString(),
            user: {
                ...task.user,
                _id: task.user._id.toString(),
            },
        }));
    }
    async getNotebook(id) {
        return this.notebookService.getNotebookById(id);
    }
    async getUserNotebook(id, context) {
        const userId = context.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('User is not authenticated');
        }
        const notebook = await this.notebookService.getNotebookById(id);
        if (!notebook) {
            throw new common_1.NotFoundException(`Notebook with ID ${id} not found`);
        }
        if (notebook.user._id.toString() !== userId) {
            throw new common_1.UnauthorizedException('You are not authorized to view this notebook');
        }
        return {
            ...notebook,
            _id: notebook._id.toString(),
            user: {
                ...notebook.user,
                _id: notebook.user._id.toString(),
            },
        };
    }
    async createNotebook(createNotebookInput, context) {
        console.log('Context:', context);
        if (!context.user) {
            throw new common_1.UnauthorizedException('User is not in context');
        }
        const userId = context.user.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('User ID (sub) is not defined');
        }
        const notebook = await this.notebookService.createNotebook(createNotebookInput, userId);
        // Pubblica l'evento notebookCreated dopo la creazione del notebook
        this.pubSub.publish('notebookCreated', { notebookCreated: notebook });
        return notebook;
    }
    notebookCreated() {
        return this.pubSub.asyncIterator('notebookCreated');
    }
    async updateNotebook(id, updateNotebookInput, context) {
        const userId = context.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('User is not authenticated');
        }
        // Assicurati che l'ID sia incluso nell'input
        updateNotebookInput.id = id;
        const notebookUpdated = await this.notebookService.updateNotebook(updateNotebookInput, userId);
        this.pubSub.publish('notebookUpdated', { notebookUpdated: notebookUpdated });
        return notebookUpdated;
    }
    notebookUpdated() {
        return this.pubSub.asyncIterator('notebookUpdated');
    }
    async deleteNotebook(id, context) {
        const userId = context.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('User is not authenticated');
        }
        await this.notebookService.deleteNotebook(id, userId);
        return true;
    }
};
exports.NotebookResolver = NotebookResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [notebook_type_1.NotebookType]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], NotebookResolver.prototype, "getAllNotebooks", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [notebook_type_1.NotebookType]),
    tslib_1.__param(0, (0, graphql_1.Context)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], NotebookResolver.prototype, "getUserNotebooks", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => notebook_type_1.NotebookType),
    tslib_1.__param(0, (0, graphql_1.Args)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], NotebookResolver.prototype, "getNotebook", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => notebook_type_1.NotebookType),
    tslib_1.__param(0, (0, graphql_1.Args)('id')),
    tslib_1.__param(1, (0, graphql_1.Context)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], NotebookResolver.prototype, "getUserNotebook", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => notebook_type_1.NotebookType),
    tslib_1.__param(0, (0, graphql_1.Args)('createNotebookInput')),
    tslib_1.__param(1, (0, graphql_1.Context)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_e = typeof create_notebook_input_1.CreateNotebookInput !== "undefined" && create_notebook_input_1.CreateNotebookInput) === "function" ? _e : Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NotebookResolver.prototype, "createNotebook", null);
tslib_1.__decorate([
    (0, graphql_1.Subscription)(() => notebook_type_1.NotebookType, {
        filter: (payload, variables, context) => {
            return payload.notebookCreated.user._id === context.user?.sub;
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], NotebookResolver.prototype, "notebookCreated", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => notebook_type_1.NotebookType),
    tslib_1.__param(0, (0, graphql_1.Args)('id')),
    tslib_1.__param(1, (0, graphql_1.Args)('updateNotebookInput')),
    tslib_1.__param(2, (0, graphql_1.Context)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_f = typeof update_notebook_input_1.UpdateNotebookInput !== "undefined" && update_notebook_input_1.UpdateNotebookInput) === "function" ? _f : Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NotebookResolver.prototype, "updateNotebook", null);
tslib_1.__decorate([
    (0, graphql_1.Subscription)(() => notebook_type_1.NotebookType, {
        filter: (payload, variables, context) => {
            return payload.notebookUpdated.user._id === context.user?.sub;
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], NotebookResolver.prototype, "notebookUpdated", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    tslib_1.__param(0, (0, graphql_1.Args)('id')),
    tslib_1.__param(1, (0, graphql_1.Context)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NotebookResolver.prototype, "deleteNotebook", null);
exports.NotebookResolver = NotebookResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(() => notebook_type_1.NotebookType),
    tslib_1.__param(1, (0, common_1.Inject)('PUB_SUB')),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof notebook_service_1.NotebookService !== "undefined" && notebook_service_1.NotebookService) === "function" ? _a : Object, typeof (_b = typeof graphql_subscriptions_1.PubSub !== "undefined" && graphql_subscriptions_1.PubSub) === "function" ? _b : Object])
], NotebookResolver);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotebookType = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(14);
const user_type_1 = __webpack_require__(19);
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
tslib_1.__decorate([
    (0, graphql_1.Field)(() => user_type_1.UserType),
    tslib_1.__metadata("design:type", typeof (_c = typeof user_type_1.UserType !== "undefined" && user_type_1.UserType) === "function" ? _c : Object)
], NotebookType.prototype, "user", void 0);
exports.NotebookType = NotebookType = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], NotebookType);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserType = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(14);
const notebook_type_1 = __webpack_require__(18);
let UserType = class UserType {
};
exports.UserType = UserType;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    tslib_1.__metadata("design:type", String)
], UserType.prototype, "_id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], UserType.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], UserType.prototype, "email", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => [notebook_type_1.NotebookType], { nullable: true }),
    tslib_1.__metadata("design:type", Array)
], UserType.prototype, "notebooks", void 0);
exports.UserType = UserType = tslib_1.__decorate([
    (0, graphql_1.ObjectType)()
], UserType);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("graphql-subscriptions");

/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const nestjs_1 = __webpack_require__(6);
const user_service_1 = __webpack_require__(23);
const user_controller_1 = __webpack_require__(26);
const user_entity_1 = __webpack_require__(11);
const user_resolver_1 = __webpack_require__(31);
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [nestjs_1.MikroOrmModule.forFeature([user_entity_1.User])],
        providers: [user_service_1.UserService, user_resolver_1.UserResolver],
        controllers: [user_controller_1.UserController],
        exports: [user_service_1.UserService], // Esporta UserService per essere utilizzato in altri moduli
    })
], UserModule);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const user_entity_1 = __webpack_require__(11);
const jwt = tslib_1.__importStar(__webpack_require__(24));
const mongodb_1 = __webpack_require__(10);
const bcrypt_1 = tslib_1.__importDefault(__webpack_require__(25));
const mongodb_2 = __webpack_require__(10);
let UserService = class UserService {
    constructor(orm) {
        this.orm = orm;
    }
    get em() {
        return this.orm.em.fork(); // Crea un nuovo EntityManager per il contesto specifico
    }
    async createUser(createUserInput) {
        const em = this.em;
        const { name, email, password } = createUserInput;
        // Verifica che la password non sia undefined o null
        if (!password) {
            throw new Error('Password is required');
        }
        const existingUser = await em.findOne(user_entity_1.User, { email });
        if (existingUser) {
            throw new common_1.NotFoundException('User already exists');
        }
        try {
            // Assicurati che bcrypt stia ricevendo la password corretta
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const user = new user_entity_1.User();
            user.name = name;
            user.email = email;
            user.password = hashedPassword;
            await em.persistAndFlush(user);
            return user;
        }
        catch (error) {
            console.error('Error hashing password:', error);
            throw new Error('Error creating user');
        }
    }
    async loginUser(loginUserInput) {
        const { email, password } = loginUserInput;
        const user = await this.em.findOne(user_entity_1.User, { email });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user._id, email: user.email };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        console.log('Generated access token:', accessToken);
        return { accessToken };
    }
    // async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    //     const em = this.em;
    //     const { id, name, email, password,newPassword } = updateUserInput;
    //     const user = await em.findOne(User, { _id: new ObjectId(id) });
    //     if (!user) {
    //         throw new NotFoundException(`User with ID ${id} not found`);
    //     }
    //     if(name) user.name = name
    //     if (email) user.email = email;
    //     if (password) {
    //         const isMatch = await bcrypt.compare(password, user.password);
    //         if (!isMatch) {
    //             throw new UnauthorizedException('Incorrect password');
    //         }
    //         if (newPassword) {
    //             user.password = await bcrypt.hash(newPassword, 10);
    //         }
    //     }
    //     await em.flush()
    //     return user;
    // }
    async changeUserPassword(id, currentPassword, newPassword) {
        const em = this.em;
        const user = await em.findOne(user_entity_1.User, { _id: new mongodb_2.ObjectId(id) });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        // Verifica che la password corrente sia corretta
        const isMatch = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Incorrect password');
        }
        // Hash e aggiorna la nuova password
        user.password = await bcrypt_1.default.hash(newPassword, 10);
        await em.flush();
    }
    async updateUserInfo(id, name, email) {
        const em = this.em;
        const user = await em.findOne(user_entity_1.User, { _id: new mongodb_2.ObjectId(id) });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        await em.flush();
        return user;
    }
    async deleteUser(id) {
        const em = this.em;
        const user = await em.findOne(user_entity_1.User, { _id: new mongodb_2.ObjectId(id) });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        await em.removeAndFlush(user);
    }
    async getUserById(id) {
        const user = await this.em.findOne(user_entity_1.User, { _id: new mongodb_2.ObjectId(id) });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongodb_1.MikroORM !== "undefined" && mongodb_1.MikroORM) === "function" ? _a : Object])
], UserService);


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const user_service_1 = __webpack_require__(23);
const user_create_input_1 = __webpack_require__(27);
const user_update_input_1 = __webpack_require__(28);
const user_login_input_1 = __webpack_require__(29);
const user_update_password_1 = __webpack_require__(30);
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUser(id) {
        return await this.userService.getUserById(id);
    }
    async updateUserPassword(id, changePasswordInput) {
        return await this.userService.changeUserPassword(id, changePasswordInput.currentPassword, changePasswordInput.newPassword);
    }
    async updateUser(id, updateUserInput) {
        return await this.userService.updateUserInfo(id, updateUserInput.name, updateUserInput.email);
    }
    async deleteUser(id) {
        return await this.userService.deleteUser(id);
    }
    async login(loginUserInput) {
        return await this.userService.loginUser(loginUserInput);
    }
    async createUser(createUserInput) {
        return await this.userService.createUser(createUserInput);
    }
};
exports.UserController = UserController;
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], UserController.prototype, "getUser", null);
tslib_1.__decorate([
    (0, common_1.Put)('password/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof user_update_password_1.ChangePasswordInput !== "undefined" && user_update_password_1.ChangePasswordInput) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], UserController.prototype, "updateUserPassword", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_e = typeof user_update_input_1.UpdateUserInput !== "undefined" && user_update_input_1.UpdateUserInput) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], UserController.prototype, "updateUser", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], UserController.prototype, "deleteUser", null);
tslib_1.__decorate([
    (0, common_1.Post)('/login'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_h = typeof user_login_input_1.loginUserInput !== "undefined" && user_login_input_1.loginUserInput) === "function" ? _h : Object]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], UserController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.Post)('/create'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_k = typeof user_create_input_1.CreateUserInput !== "undefined" && user_create_input_1.CreateUserInput) === "function" ? _k : Object]),
    tslib_1.__metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], UserController.prototype, "createUser", null);
exports.UserController = UserController = tslib_1.__decorate([
    (0, common_1.Controller)('user'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], UserController);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserInput = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(14);
let CreateUserInput = class CreateUserInput {
};
exports.CreateUserInput = CreateUserInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], CreateUserInput.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], CreateUserInput.prototype, "email", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], CreateUserInput.prototype, "password", void 0);
exports.CreateUserInput = CreateUserInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CreateUserInput);


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserInput = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(14);
let UpdateUserInput = class UpdateUserInput {
};
exports.UpdateUserInput = UpdateUserInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], UpdateUserInput.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateUserInput.prototype, "name", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], UpdateUserInput.prototype, "email", void 0);
exports.UpdateUserInput = UpdateUserInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], UpdateUserInput);


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loginUserInput = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(14);
let loginUserInput = class loginUserInput {
};
exports.loginUserInput = loginUserInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], loginUserInput.prototype, "email", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], loginUserInput.prototype, "password", void 0);
exports.loginUserInput = loginUserInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], loginUserInput);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangePasswordInput = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(14);
let ChangePasswordInput = class ChangePasswordInput {
};
exports.ChangePasswordInput = ChangePasswordInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], ChangePasswordInput.prototype, "id", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], ChangePasswordInput.prototype, "currentPassword", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(),
    tslib_1.__metadata("design:type", String)
], ChangePasswordInput.prototype, "newPassword", void 0);
exports.ChangePasswordInput = ChangePasswordInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], ChangePasswordInput);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserResolver = void 0;
const tslib_1 = __webpack_require__(5);
const graphql_1 = __webpack_require__(14);
const user_service_1 = __webpack_require__(23);
const user_type_1 = __webpack_require__(19);
const user_create_input_1 = __webpack_require__(27);
const user_update_input_1 = __webpack_require__(28);
const user_login_input_1 = __webpack_require__(29);
const common_1 = __webpack_require__(1);
let UserResolver = class UserResolver {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(createUserInput) {
        const user = await this.userService.createUser(createUserInput);
        return {
            ...user,
            _id: user._id.toString(),
        };
    }
    async loginUser(loginUserInput) {
        const { accessToken } = await this.userService.loginUser(loginUserInput);
        return accessToken;
    }
    async changeUserPassword(id, currentPassword, newPassword) {
        await this.userService.changeUserPassword(id, currentPassword, newPassword);
        return true;
    }
    async updateUserInfo(updateUserInput, context) {
        console.log('Update Input:', updateUserInput); // Logga l'input ricevuto
        const userId = context.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('User is not authenticated');
        }
        if (userId !== updateUserInput.id) {
            throw new common_1.UnauthorizedException('You are not authorized to update this user data');
        }
        const user = await this.userService.updateUserInfo(updateUserInput.id, updateUserInput.name, updateUserInput.email);
        return {
            ...user,
            _id: user._id.toString(),
        };
    }
    async deleteUser(id, context) {
        const userId = context.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('User is not authenticated');
        }
        if (userId !== id) {
            throw new common_1.UnauthorizedException('You are not authorized to delete this user');
        }
        await this.userService.deleteUser(id);
        return true;
    }
    async getUserById(context // Recupera il contesto
    ) {
        // Estrai l'ID utente dal token JWT che si trova nel contesto
        const userId = context.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('Utente non autenticato');
        }
        // Ora, usa l'ID utente per recuperare le informazioni dell'utente
        const user = await this.userService.getUserById(userId); // Qui usi `userId`, non quello passato via argomenti
        return {
            ...user,
            _id: user._id.toString(),
        };
    }
};
exports.UserResolver = UserResolver;
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => user_type_1.UserType),
    tslib_1.__param(0, (0, graphql_1.Args)('createUserInput')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof user_create_input_1.CreateUserInput !== "undefined" && user_create_input_1.CreateUserInput) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], UserResolver.prototype, "createUser", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => String),
    tslib_1.__param(0, (0, graphql_1.Args)('loginUserInput')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof user_login_input_1.loginUserInput !== "undefined" && user_login_input_1.loginUserInput) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], UserResolver.prototype, "loginUser", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    tslib_1.__param(0, (0, graphql_1.Args)('id')),
    tslib_1.__param(1, (0, graphql_1.Args)('currentPassword')),
    tslib_1.__param(2, (0, graphql_1.Args)('newPassword')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], UserResolver.prototype, "changeUserPassword", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => user_type_1.UserType),
    tslib_1.__param(0, (0, graphql_1.Args)('updateUserInput')),
    tslib_1.__param(1, (0, graphql_1.Context)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_g = typeof user_update_input_1.UpdateUserInput !== "undefined" && user_update_input_1.UpdateUserInput) === "function" ? _g : Object, Object]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], UserResolver.prototype, "updateUserInfo", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    tslib_1.__param(0, (0, graphql_1.Args)('id')),
    tslib_1.__param(1, (0, graphql_1.Context)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], UserResolver.prototype, "deleteUser", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => user_type_1.UserType),
    tslib_1.__param(0, (0, graphql_1.Context)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], UserResolver.prototype, "getUserById", null);
exports.UserResolver = UserResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(() => user_type_1.UserType),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], UserResolver);


/***/ }),
/* 32 */
/***/ ((module) => {

module.exports = require("dotenv");

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