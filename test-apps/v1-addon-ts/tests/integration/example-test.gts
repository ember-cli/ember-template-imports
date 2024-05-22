import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";

import { Classy, TemplateOnly } from "v1-addon-ts/components/example";

module("Rendering | Example", function (hooks) {
  setupRenderingTest(hooks);

  test("it works", async function (assert) {
    await render(<template>
      <output id="classy"><Classy /></output>
      <output id="template-only"><TemplateOnly /></output>
    </template>);

    assert.dom("#classy").containsText("hello there");
    assert.dom("#classy").containsText("Template only!");
    assert.dom("#template-only").hasText("Template only!");
  });
});
