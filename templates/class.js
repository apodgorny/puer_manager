import Puer, {PuerComponent} from '../../puer.js'


class <className> extends PuerComponent {
	constructor(props, children) {
		super(props, children)
	}

	render() {
		return div(this.children)
	}
}

Puer.define(<className>, import.meta.url)
export default <className>