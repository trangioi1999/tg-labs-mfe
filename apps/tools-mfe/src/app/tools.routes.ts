import type { Routes } from '@angular/router';
import { Base64Tool } from './features/base64/base64-tool';
import { JsonFormatter } from './features/json-formatter/json-formatter';
import { JwtDecoder } from './features/jwt-decoder/jwt-decoder';
import { ToolsHome } from './features/tools-home/tools-home';
import { ToolsLayout } from './tools-layout';

/** Public route contract of the Tools remote, exposed as `./routes`. */
export const routes: Routes = [
  {
    path: '',
    component: ToolsLayout,
    children: [
      { path: '', component: ToolsHome, title: 'Tools' },
      { path: 'json-formatter', component: JsonFormatter, title: 'JSON Formatter' },
      { path: 'base64', component: Base64Tool, title: 'Base64 Encoder / Decoder' },
      { path: 'jwt-decoder', component: JwtDecoder, title: 'JWT Decoder' },
    ],
  },
];
