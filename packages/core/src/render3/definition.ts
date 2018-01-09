/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RendererType2} from '../render/api';
import {Type} from '../type';
import {resolveRendererType2} from '../view/util';

import {componentRefresh, diPublic} from './instructions';
import {ComponentDef, ComponentDefArgs, DirectiveDef, DirectiveDefArgs} from './interfaces/definition';



/**
 * Create a component definition object.
 *
 *
 * # Example
 * ```
 * class MyDirective {
 *   // Generated by Angular Template Compiler
 *   // [Symbol] syntax will not be supported by TypeScript until v2.7
 *   static [COMPONENT_DEF_SYMBOL] = defineComponent({
 *     ...
 *   });
 * }
 * ```
 */
export function defineComponent<T>(componentDefinition: ComponentDefArgs<T>): ComponentDef<T> {
  const def = <ComponentDef<any>>{
    type: componentDefinition.type,
    diPublic: null,
    n: componentDefinition.factory,
    tag: (componentDefinition as ComponentDefArgs<T>).tag || null !,
    template: (componentDefinition as ComponentDefArgs<T>).template || null !,
    r: componentDefinition.refresh ||
        function(d: number, e: number) { componentRefresh(d, e, componentDefinition.template); },
    h: componentDefinition.hostBindings || noop,
    inputs: invertObject(componentDefinition.inputs),
    outputs: invertObject(componentDefinition.outputs),
    methods: invertObject(componentDefinition.methods),
    rendererType: resolveRendererType2(componentDefinition.rendererType) || null,
    exportAs: componentDefinition.exportAs,
  };
  const feature = componentDefinition.features;
  feature && feature.forEach((fn) => fn(def));
  return def;
}

export function NgOnChangesFeature<T>(definition: DirectiveDef<T>) {
  // TODO: implement. See: https://app.asana.com/0/443577627818617/465170715764659
}

export function PublicFeature<T>(definition: DirectiveDef<T>) {
  definition.diPublic = diPublic;
}

const EMPTY = {};

function noop() {}

/** Swaps the keys and values of an object. */
function invertObject(obj: any): any {
  if (obj == null) return EMPTY;
  const newObj: any = {};
  for (let minifiedKey in obj) {
    newObj[obj[minifiedKey]] = minifiedKey;
  }
  return newObj;
}

/**
 * Create a directive definition object.
 *
 * # Example
 * ```
 * class MyDirective {
 *   // Generated by Angular Template Compiler
 *   // [Symbol] syntax will not be supported by TypeScript until v2.7
 *   static [DIRECTIVE_DEF_SYMBOL] = defineDirective({
 *     ...
 *   });
 * }
 * ```
 */
export const defineDirective = defineComponent as<T>(directiveDefinition: DirectiveDefArgs<T>) =>
    DirectiveDef<T>;